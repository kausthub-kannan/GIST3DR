import math
import numpy as np
import cv2


def get_width(polygon, top_point, mm=2, scaling_factor=0.6, mm_to_px=0.2645833333):
    line_y = int(top_point[1] + mm * (scaling_factor * mm_to_px) ** -1)
    polygon_at_y = polygon[polygon[:, 1] <= line_y]

    left_x = np.min(polygon_at_y[:, 0])
    right_x = np.max(polygon_at_y[:, 0])

    h_dist = math.sqrt((right_x - left_x) ** 2 + (line_y - np.min(polygon[:, 1])) ** 2)
    return round(h_dist * scaling_factor * mm_to_px, 2)


def get_height(start_point, end_point, scaling_factor=0.6, mm_to_px=0.2645833333):
    distance = math.sqrt(
        (end_point[0] - start_point[0]) ** 2 + (end_point[1] - start_point[1]) ** 2
    )

    return round(distance * scaling_factor * mm_to_px, 2)


def get_area(mask, mm_to_px=0.2645833333):
    return round(np.sum(mask) * mm_to_px**2, 2)


def get_top_and_down_points(polygon):
    min_y = np.min(polygon[:, 1])
    t_points = polygon[polygon[:, 1] == min_y]
    left_top_point = t_points[np.argmin(t_points[:, 0])]
    right_top_point = t_points[np.argmax(t_points[:, 0])]
    top_point = (left_top_point + right_top_point) / 2
    down_point = polygon[np.argmax(polygon[:, 1])]
    return top_point, down_point


def get_measurements(class_id, mask):
    measurement = {
        "width": 0.0,
        "height": 0.0,
    }

    if class_id in [1, 2]:
        contours, _ = cv2.findContours(
            mask.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
        )
        if contours:
            polygon = contours[0].squeeze()
            if len(polygon.shape) == 2:
                top_point, down_point = get_top_and_down_points(polygon)

                measurement["width"] = get_width(polygon, top_point, mm=8)
                measurement["height"] = get_height(top_point, down_point)

    return measurement["width"], measurement["height"]
