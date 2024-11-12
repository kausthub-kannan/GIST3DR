import numpy as np
from skimage import measure


class OBJExporter:
    def _multiple_masks_to_obj(self, masks_list, base_height=0.0, layer_height=1.0):
        all_vertices = []
        all_faces = []
        total_vertex_count = 0

        for mask_index, mask_2d in enumerate(masks_list):
            mask = np.array(mask_2d, dtype=bool)
            current_height = base_height + (mask_index * layer_height)

            contours = measure.find_contours(mask.astype(float), 0.5)

            for contour in contours:
                bottom_start = total_vertex_count

                for point in contour:
                    all_vertices.append([point[1], point[0], current_height])

                top_start = total_vertex_count + len(contour)
                for point in contour:
                    all_vertices.append(
                        [point[1], point[0], current_height + layer_height]
                    )

                num_points = len(contour)
                for i in range(num_points):
                    v1 = bottom_start + i
                    v2 = bottom_start + (i + 1) % num_points
                    v3 = top_start + i
                    v4 = top_start + (i + 1) % num_points

                    all_faces.append([v1 + 1, v2 + 1, v3 + 1])
                    all_faces.append([v2 + 1, v4 + 1, v3 + 1])

                total_vertex_count += 2 * num_points

        obj_lines = []
        for v in all_vertices:
            obj_lines.append(f"v {v[0]:.6f} {v[1]:.6f} {v[2]:.6f}")

        for f in all_faces:
            obj_lines.append(f"f {f[0]} {f[1]} {f[2]}")

        return "\n".join(obj_lines)

    def save_multiple_masks_to_obj(self, masks_list):
        num_masks = len(masks_list)

        base_height = 0.0

        base_layer_height = 3.0
        scaling_factor = 0.01
        layer_height = base_layer_height - (num_masks * scaling_factor)
        layer_height = max(layer_height, 0.1)

        if not masks_list:
            raise ValueError("Empty masks list provided")

        print(f"Processing {len(masks_list)} masks...")

        for i, mask in enumerate(masks_list):
            mask_array = np.array(mask)
            if not np.all(np.logical_or(mask_array == 0, mask_array == 1)):
                raise ValueError(f"Mask at index {i} contains non-binary values")

        obj_content = self._multiple_masks_to_obj(masks_list, base_height, layer_height)

        if obj_content:
            return obj_content
        else:
            raise ValueError("No OBJ content generated")
