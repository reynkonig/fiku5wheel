import {
  IMeshGeometryData,
  IWheelGeometrySettings,
} from '../Interfaces';

export interface IGeneratePointerGeometryDataProps {
  geometrySettings: IWheelGeometrySettings;
}

export default function GeneratePointerGeometryData({ geometrySettings } : IGeneratePointerGeometryDataProps): IMeshGeometryData {
  const vertices: number[] = [];

  const length = geometrySettings.outerRingWidth + geometrySettings.textPadding / 2;
  const height = length * 2;

  const halfLength = length / 2;
  const halfHeight = height / 2;

  for(let heightIndex = 0; heightIndex < 2; heightIndex++) {
    const h = heightIndex * geometrySettings.pointerThickness;
    vertices.push(
      halfLength, 0, h,
      -halfLength, halfHeight, h,
      -halfLength, -halfHeight, h
    )
  }

  const triangles: number[] = [
    3, 4, 5,
    5, 4, 1,
    5, 1, 2,
    1, 4, 3,
    1, 3, 0,
    2, 1, 0,
    5, 2, 0,
    5, 0, 3
  ];

  return { vertices, triangles };
}
