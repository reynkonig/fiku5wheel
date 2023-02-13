import * as THREE from 'three';

import { useEffect, useRef } from 'react';

import { useAtomValue } from 'jotai';

import { MeshGeometryDataGenerator } from '../../common/types';

import { geometrySettingsAtom } from '../../atoms/SettingsAtoms';


interface IProceduralMeshProps {
  material: THREE.Material;
  generator: MeshGeometryDataGenerator;
}

export default function ProceduralMesh({ generator, material }: IProceduralMeshProps & { [p: string]: any }) {
  const geometrySettings = useAtomValue(geometrySettingsAtom);
  const geometryRef = useRef(new THREE.BufferGeometry());

  useEffect(() => {
    const geometryData = generator(geometrySettings);

    geometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute(geometryData.vertices, 3));
    geometryRef.current.setIndex(geometryData.triangles as number[]);

  }, [ generator, geometrySettings ]);

  return (
    <mesh
      material={material}
      geometry={geometryRef.current}
    />
  );
}
