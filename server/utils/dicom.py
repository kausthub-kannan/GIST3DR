import cv2
import SimpleITK as sitk
from typing import Tuple, Dict, Any
import pydicom
from pydicom.dataset import Dataset, FileDataset
import pydicom.uid
import numpy as np
import datetime


class DICOMprocessor:
    def __init__(self, directory_path) -> Tuple[Any, np.ndarray, Dict[str, Any]]:
        self.input_file = directory_path
        self.output_file = "processed.dcm"

    def add_white_padding(self, image, padding_size):
        return cv2.copyMakeBorder(
            image,
            top=padding_size,
            bottom=padding_size,
            left=padding_size,
            right=padding_size,
            borderType=cv2.BORDER_CONSTANT,
            value=[255, 255, 255],
        )

    def process_image(self, image, crop_coords, alpha=1.7, beta=-0.5, padding_size=200):
        flipped_img = cv2.flip(image, 0)
        x, y, w, h = crop_coords
        enhanced_img = cv2.convertScaleAbs(
            flipped_img[y : y + h, x : x + w], alpha=alpha, beta=beta
        )
        return self.add_white_padding(enhanced_img, padding_size)

    def read_dicom_series(self):
        reader = sitk.ImageSeriesReader()
        series_IDs = reader.GetGDCMSeriesIDs(self.input_file)

        if not series_IDs:
            raise ValueError("No DICOM series found in the specified directory.")

        dicom_names = reader.GetGDCMSeriesFileNames(self.input_file, series_IDs[0])
        reader.SetFileNames(dicom_names)
        sitk_image = reader.Execute()

        numpy_array = sitk.GetArrayFromImage(sitk_image)

        metadata = {
            "Size": sitk_image.GetSize(),
            "Spacing": sitk_image.GetSpacing(),
            "Origin": sitk_image.GetOrigin(),
            "Direction": sitk_image.GetDirection(),
        }

        return sitk_image, numpy_array, metadata

    def _get_image(
        self,
        image_array,
        window_center=None,
        window_width=None,
        view="axial",
        slice_index=0,
    ):
        if view == "axial":
            display_array = (
                image_array[slice_index] if image_array.ndim == 3 else image_array
            )
        elif view == "coronal":
            if image_array.ndim == 3:
                display_array = image_array[:, slice_index, :]
            else:
                raise ValueError("Coronal view is not available for 2D images.")
        elif view == "sagittal":
            if image_array.ndim == 3:
                display_array = image_array[:, :, slice_index]
            else:
                raise ValueError("Sagittal view is not available for 2D images.")
        else:
            raise ValueError("View must be one of 'axial', 'coronal', or 'sagittal'.")

        if window_center is not None and window_width is not None:
            intensityFilter = sitk.IntensityWindowingImageFilter()
            intensityFilter.SetWindowMaximum(window_center + window_width / 2.0)
            intensityFilter.SetWindowMinimum(window_center - window_width / 2.0)

            sitk_image = sitk.GetImageFromArray(display_array.astype(float))
            sitk_windowed = intensityFilter.Execute(sitk_image)
            display_array = sitk.GetArrayFromImage(sitk_windowed)

        if display_array.max() != display_array.min():
            display_array = (display_array - display_array.min()) / (
                display_array.max() - display_array.min()
            )

        return (display_array * 255).astype(np.uint8)

    def _save_as_dcm(self, slices):
        slices = np.asarray(slices)

        if slices.dtype != np.uint16:
            slices = slices.astype(np.uint16)

        file_meta = Dataset()
        file_meta.MediaStorageSOPClassUID = "1.2.840.10008.5.1.4.1.1.2"
        file_meta.MediaStorageSOPInstanceUID = pydicom.uid.generate_uid()
        file_meta.TransferSyntaxUID = (
            pydicom.uid.ImplicitVRLittleEndian
        )  # Changed to Implicit VR

        ds = FileDataset(
            self.output_file, {}, file_meta=file_meta, preamble=b"\0" * 128
        )

        ds.SOPClassUID = file_meta.MediaStorageSOPClassUID
        ds.SOPInstanceUID = file_meta.MediaStorageSOPInstanceUID
        ds.StudyInstanceUID = pydicom.uid.generate_uid()
        ds.SeriesInstanceUID = pydicom.uid.generate_uid()

        dt = datetime.datetime.now()
        ds.ContentDate = dt.strftime("%Y%m%d")
        ds.ContentTime = dt.strftime("%H%M%S.%f")

        ds.SamplesPerPixel = 1
        ds.PhotometricInterpretation = "MONOCHROME2"
        ds.Rows = slices.shape[1]
        ds.Columns = slices.shape[2]
        ds.BitsAllocated = 16
        ds.BitsStored = 16
        ds.HighBit = 15
        ds.PixelRepresentation = 0
        ds.NumberOfFrames = len(slices)

        if not slices.flags.c_contiguous:
            slices = np.ascontiguousarray(slices)

        ds.PixelData = slices.tobytes()
        ds.save_as(self.output_file, write_like_original=False)

        return ds

    def get_modified_dicom(self, start_slice, end_slice, crop_coords):
        sitk_image, image_array, metadata = self.read_dicom_series()
        selected_slices = []

        for idx in range(start_slice, end_slice):
            slice_img = self._get_image(image_array, view="coronal", slice_index=idx)
            processed_img = self.process_image(slice_img, crop_coords)
            selected_slices.append(processed_img)

        self._save_as_dcm(np.array(selected_slices))

        return selected_slices


def read_dicom_slices(dcm_path):
    ds = pydicom.dcmread(dcm_path)
    slices = ds.pixel_array
    return slices
