import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { useAtomValue } from 'jotai';

import GeneratePointerGeometryData
  from '../common/geometry/GeneratePointerGeometryData';

import { geometrySettingsAtom } from '../atoms/SettingsAtoms';

export interface IPointerProps {
  material: THREE.Material;
}

export default function Pointer({ material, ...props }: IPointerProps & { [p: string] : any }) {
  const geometrySettings = useAtomValue(geometrySettingsAtom);
  const geometryRef = useRef(new THREE.BufferGeometry());

  useEffect(() => {
    const geometryData = GeneratePointerGeometryData({ geometrySettings });

    geometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute(geometryData.vertices, 3));
    geometryRef.current.setIndex(geometryData.triangles as number[]);

  }, [ geometrySettings ]);

  return (
    <mesh
      material={material}
      geometry={geometryRef.current}
      {...props}
    />
  );
}
