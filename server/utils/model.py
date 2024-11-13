import logging

import torch
import numpy as np
import torchvision.transforms as T
from torchvision.models.detection import maskrcnn_resnet50_fpn
from torchvision.models.detection.faster_rcnn import FastRCNNPredictor
from torchvision.models.detection.mask_rcnn import MaskRCNNPredictor
from huggingface_hub import hf_hub_download
from utils.dicom import read_dicom_slices
from utils.measurements import get_measurements
from utils.schema import Detections

logger = logging.getLogger(__name__)


class SegGEN:
    def __init__(self, model_path, device, repo_id="kausthubkannan17/AlveolarSegGEN"):
        self.model_path = model_path
        self.device = device
        self.model = self._get_model(num_classes=4)
        self.model.load_state_dict(
            torch.load(
                hf_hub_download(
                    repo_id=repo_id, filename=model_path, cache_dir="/.cache"
                ),
                map_location=torch.device(self.device),
                weights_only=True,
            )
        )
        self.model.to(self.device)

    def _get_model(self, num_classes):
        model = maskrcnn_resnet50_fpn(weights="DEFAULT")
        in_features = model.roi_heads.box_predictor.cls_score.in_features
        model.roi_heads.box_predictor = FastRCNNPredictor(in_features, num_classes)
        in_features_mask = model.roi_heads.mask_predictor.conv5_mask.in_channels
        hidden_layer = 256
        model.roi_heads.mask_predictor = MaskRCNNPredictor(
            in_features_mask, hidden_layer, num_classes
        )
        return model

    def _run_model_on_image(self, image):
        self.model.eval()
        transform = T.Compose([T.ToTensor()])
        image_tensor = transform(image).unsqueeze(0).to(self.device)

        with torch.no_grad():
            prediction = self.model(image_tensor)[0]

        return prediction

    def _generate_masks(self, detections, confidence_threshold=0.75):
        final_masks = {}

        label_groups = {}

        for i, (mask, confidence, class_id) in enumerate(
            zip(detections.mask, detections.confidence, detections.class_id)
        ):
            if confidence >= confidence_threshold:
                if class_id not in label_groups:
                    label_groups[class_id] = []
                label_groups[class_id].append((mask, confidence, i))

        top_masks = {}

        for label, masks in label_groups.items():
            if masks:
                top_masks[label] = max(masks, key=lambda x: x[1])

        for primary_label in [1, 2, 3]:
            if primary_label not in top_masks:
                continue

            primary_mask, primary_confidence, _ = top_masks[primary_label]

            mask_to_subtract = np.zeros_like(primary_mask, dtype=bool)

            for other_label in [2, 3]:
                if other_label == primary_label or other_label not in top_masks:
                    continue

                other_mask, _, _ = top_masks[other_label]
                mask_to_subtract |= other_mask

            final_mask = primary_mask & ~mask_to_subtract

            final_masks[primary_label] = final_mask

        return final_masks

    def get_masks(self, image):
        prediction = self._run_model_on_image(image)
        detections = Detections(
            xyxy=prediction["boxes"].cpu().numpy(),
            confidence=prediction["scores"].cpu().numpy(),
            class_id=prediction["labels"].cpu().numpy(),
            mask=np.array(prediction["masks"].squeeze().cpu().numpy() > 0.5),
        )
        return self._generate_masks(detections)


def masks_generator_pipeline(slices, model_path="model.pth"):

    device = "cuda" if torch.cuda.is_available() else "cpu"
    seg_gen = SegGEN(model_path, device)

    selected_masks = {1: [], 2: [], 3: []}

    selected_measurement = {
        1: {
            "height": [],
            "width": [],
        },
        2: {
            "height": [],
            "width": [],
        },
    }

    for idx, slc in enumerate(slices):
        slc_float = slc.astype(np.float32)
        slc_normalized = slc_float / slc_float.max()

        masks = seg_gen.get_masks(slc_normalized)
        for label, mask in masks.items():
            selected_masks[label].append(mask)
            width, height = get_measurements(label, mask)

            selected_measurement[label]["height"] = height
            selected_measurement[label]["width"] = width

    print(f"{len(selected_masks)} label slices processed")

    return selected_masks, selected_measurement


if __name__ == "__main__":
    slices = read_dicom_slices("../processed.dcm")
    masks_generator_pipeline(slices)
