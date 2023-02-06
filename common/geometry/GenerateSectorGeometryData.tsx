import _ from 'lodash';
import { IMeshGeometryData } from '../interfaces';

const SECTOR_ANGLE_OFFSET = -90;

interface IGenerateSectorGeometryDataProps {
  radius: number;
  angle: number;
  resolution: number;
  depth: number;
}

export function GenerateSectorGeometryData({ radius, angle, resolution, depth }: IGenerateSectorGeometryDataProps): IMeshGeometryData {
  const vertices: number[] = [];
  const triangles: number[] = [];

  const stepsCount = _.clamp(Math.floor(angle / resolution), 2, 360);
  const stepAngle = angle / (stepsCount - 1);
  const startAngle = SECTOR_ANGLE_OFFSET + -angle / 2;
  const vertsPerDepth = stepsCount + 1;

  for(let depthIndex = 0; depthIndex < 2; depthIndex++) {
    const z = depthIndex * depth;
    vertices.push(0, 0, z);

    for(let subAngleIndex = 0; subAngleIndex < stepsCount; subAngleIndex++) {
      const radAngle = (startAngle + subAngleIndex * stepAngle) * Math.PI / 180;
      vertices.push(Math.sin(radAngle) * radius, Math.cos(radAngle) * radius, z);

      const depthOffset = vertsPerDepth * depthIndex;
      const trianglesChunk = [depthOffset + subAngleIndex, depthOffset, depthOffset + subAngleIndex + 1];
      triangles.push(...(!depthIndex ? trianglesChunk.reverse() : trianglesChunk));

      if (depthIndex && subAngleIndex !== stepsCount - 1) {
        triangles.push(
          1 + vertsPerDepth + subAngleIndex, 1 + subAngleIndex + 1, 1 + subAngleIndex,
          1 + vertsPerDepth + subAngleIndex, 1 + vertsPerDepth + subAngleIndex + 1, 1 + subAngleIndex + 1,
        )
      }
    }
  }

  triangles.push(
    0, vertsPerDepth, 1,
    vertsPerDepth, vertsPerDepth + 1, 1,

    vertsPerDepth, 0, vertsPerDepth - 1,
    vertsPerDepth, vertsPerDepth - 1, vertsPerDepth * 2 - 1
  )

  return { vertices, triangles }
}
