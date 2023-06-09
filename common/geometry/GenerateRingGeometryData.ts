import { MeshGeometryDataGenerator } from '../types';

const TRIANGLES_PER_LOOP = 4;

const GenerateRingGeometryData: MeshGeometryDataGenerator = (geometrySettings) => {
  const vertices: number[] = [];
  const triangles: number[] = [];

  const stepsCount = Math.floor(360 / geometrySettings.resolution * 2);
  const stepAngle = 360 /stepsCount;

  for (let angleIndex = 0; angleIndex < stepsCount; angleIndex++) {
    const angle = stepAngle * angleIndex * Math.PI / 180;

    for(let heightIndex = 0; heightIndex < 2; heightIndex++) {
      const height = heightIndex * geometrySettings.thickness;

      for(let radiusIndex = 0; radiusIndex < 2; radiusIndex++) {
        const radius = geometrySettings.radius + radiusIndex * geometrySettings.outerRingWidth;

        vertices.push(Math.sin(angle) * radius, Math.cos(angle) * radius, height)
      }
    }

    const curTriChunkOffset = TRIANGLES_PER_LOOP * angleIndex;
    const nextTriChunkOffset = angleIndex + 1 === stepsCount ? 0 : TRIANGLES_PER_LOOP * (angleIndex + 1);

    const v0 = curTriChunkOffset;
    const v1 = curTriChunkOffset + 1;
    const v2 = curTriChunkOffset + 2;
    const v3 = curTriChunkOffset + 3;
    const v4 = nextTriChunkOffset;
    const v5 = nextTriChunkOffset + 1;
    const v6 = nextTriChunkOffset + 2;
    const v7 = nextTriChunkOffset + 3;

    triangles.push(
      v0, v1, v4,
      v1, v5, v4,
      v1, v7, v5,
      v1, v3, v7,
      v2, v6, v7,
      v2, v7, v3,
      v0, v4, v2,
      v2, v4, v6
    )
  }

  return { vertices, triangles };
}

export default GenerateRingGeometryData;
