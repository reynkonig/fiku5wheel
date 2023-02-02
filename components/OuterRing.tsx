import * as THREE from 'three';
import { useEffect, useRef } from 'react';

import GenerateRingGeometryData
  from '../common/geometry/GenerateRingGeometryData';

import store from '../common/stores/Store';

export interface IOuterRingProps {
  material: THREE.Material;
}

export default function OuterRing({ material, ...props }: IOuterRingProps & { [p: string ]: any }) {
  const settings = store.settings;
  const geometryRef = useRef<THREE.BufferGeometry>(new THREE.BufferGeometry());

  useEffect(() => {
    if(geometryRef.current) {
      const geometryData = GenerateRingGeometryData({ wheelSettings: settings.geometry });

      geometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute(geometryData.vertices, 3));
      geometryRef.current.setIndex(geometryData.triangles as number[]);
    }
  }, [ settings ]);

  return (
    <group {...props}>
      <mesh material={material} geometry={geometryRef.current}/>
    </group>
  );
}
