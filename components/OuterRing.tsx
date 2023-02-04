import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { useAtomValue } from 'jotai';

import GenerateRingGeometryData
  from '../common/geometry/GenerateRingGeometryData';

import { geometrySettingsAtom } from '../atoms/SettingsAtoms';


export interface IOuterRingProps {
  material: THREE.Material;
}

export default function OuterRing({ material, ...props }: IOuterRingProps & { [p: string ]: any }) {
  const geometrySettings = useAtomValue(geometrySettingsAtom);
  const geometryRef = useRef<THREE.BufferGeometry>(new THREE.BufferGeometry());

  useEffect(() => {
    if(geometryRef.current) {
      const geometryData = GenerateRingGeometryData({ geometrySettings });

      geometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute(geometryData.vertices, 3));
      geometryRef.current.setIndex(geometryData.triangles as number[]);
    }
  }, [ geometrySettings ]);

  return (
    <group {...props}>
      <mesh material={material} geometry={geometryRef.current}/>
    </group>
  );
}
