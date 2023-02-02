import * as THREE from 'three';
import { useEffect, useRef } from 'react';

import GeneratePointerGeometryData
  from '../common/geometry/GeneratePointerGeometryData';

import store from '../common/stores/Store';

export interface IPointerProps {
  material: THREE.Material;
}

export default function Pointer({ material, ...props }: IPointerProps & { [p: string] : any }) {
  const { settings } = store;
  const geometryRef = useRef(new THREE.BufferGeometry());

  useEffect(() => {
    const geometryData = GeneratePointerGeometryData({ wheelSettings: settings.geometry });

    geometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute(geometryData.vertices, 3));
    geometryRef.current.setIndex(geometryData.triangles as number[]);

  }, [ settings ]);

  return (
    <mesh
      material={material}
      geometry={geometryRef.current}
      {...props}
    />
  );
}
