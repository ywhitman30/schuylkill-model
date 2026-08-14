"""Export 1D HEC-RAS cross-section results as a Leaflet-ready GeoJSON layer.

Usage:
  python scripts/export-hec-ras-results.py \
    "C:\\path\\to\\Schuylkill_Model.p04.hdf" \
    public/data/hec-ras-results.geojson

Install the one-time exporter dependencies with:
  pip install h5py pyproj
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import h5py
from pyproj import Transformer


SOURCE_CRS = "EPSG:2272"  # Pennsylvania South (US survey feet)
TARGET_CRS = "EPSG:4326"  # GeoJSON / Leaflet longitude, latitude


def text(value: bytes) -> str:
    return value.decode("utf-8").strip()


def coordinates(points, transformer: Transformer):
    return [list(transformer.transform(float(x), float(y))) for x, y in points]


def export_results(source: Path, destination: Path) -> None:
    transformer = Transformer.from_crs(SOURCE_CRS, TARGET_CRS, always_xy=True)

    with h5py.File(source, "r") as results:
        cross_sections = results["Geometry/Cross Sections"]
        attributes = cross_sections["Attributes"][:]
        info = cross_sections["Polyline Info"][:]
        points = cross_sections["Polyline Points"][:]
        centerline = results["Geometry/River Centerlines/Polyline Points"][:]
        summary = results[
            "Results/Unsteady/Output/Output Blocks/Base Output/Summary Output/Cross Sections"
        ]
        max_wse = summary["Maximum Water Surface"][0]
        max_velocity = summary["Maximum Channel Velocity"][0]

    features = [
        {
            "type": "Feature",
            "properties": {"layer": "model-reach", "name": "HEC-RAS modeled reach"},
            "geometry": {"type": "LineString", "coordinates": coordinates(centerline, transformer)},
        }
    ]

    for index, attribute in enumerate(attributes):
        point_start, point_count = info[index][:2]
        features.append(
            {
                "type": "Feature",
                "properties": {
                    "layer": "cross-section",
                    "river": text(attribute["River"]),
                    "reach": text(attribute["Reach"]),
                    "river_station": text(attribute["RS"]),
                    "max_water_surface_ft": round(float(max_wse[index]), 2),
                    "max_channel_velocity_fps": round(float(max_velocity[index]), 2),
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": coordinates(points[point_start : point_start + point_count], transformer),
                },
            }
        )

    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(
        json.dumps({"type": "FeatureCollection", "features": features}, indent=2),
        encoding="utf-8",
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path, help="HEC-RAS unsteady plan HDF file")
    parser.add_argument("destination", type=Path, help="GeoJSON file to create")
    arguments = parser.parse_args()
    export_results(arguments.source, arguments.destination)
