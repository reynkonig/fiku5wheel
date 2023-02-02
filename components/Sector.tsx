import _ from 'lodash';
import * as THREE from 'three';

import { Text } from '@react-three/drei';

import store from '../common/stores/Store';

export interface ISectorProps {
  label: string;
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
}

export default function Sector({ label, geometry, material, ...props }: ISectorProps & { [p: string]: any }) {
  const { settings } = store;

  return (
    <group {...props} >
      <Text
        color={settings.palette.outline}
        fontSize={_.clamp(0.075 * (1 - store.session.labeledItems.length / settings.maxLabelsCount), 0.04, 0.075)}
        anchorX='left'
        anchorY='middle'
        position={[-settings.geometry.radius + settings.geometry.textPadding, 0, settings.geometry.thickness + 0.01]}
        rotation={[0, 0, 0]}
        font='/fonts/BalsamiqSans-Bold.ttf'
      >
        {label}
      </Text>
      <mesh geometry={geometry} material={material}/>
    </group>
  );
}
