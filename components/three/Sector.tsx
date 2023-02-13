import _ from 'lodash';
import * as THREE from 'three';
import { useAtomValue } from 'jotai';

import { Text } from '@react-three/drei';

import {
  geometrySettingsAtom,
  maxItemsCountAtom,
  paletteAtom
} from '../../atoms/SettingsAtoms';
import { itemsCountAtom } from '../../atoms/ItemAtoms';


export interface ISectorProps {
  label: string;
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
}

export default function Sector({ label, geometry, material, ...props }: ISectorProps & { [p: string]: any }) {
  const palette = useAtomValue(paletteAtom);
  const geometrySettings = useAtomValue(geometrySettingsAtom);
  const itemsCount = useAtomValue(itemsCountAtom);
  const maxItemsCount = useAtomValue(maxItemsCountAtom)

  return (
    <group {...props} >
      <Text
        color={palette.outline}
        fontSize={_.clamp(0.075 * (1 - itemsCount / maxItemsCount), 0.04, 0.075)}
        anchorX='left'
        anchorY='middle'
        position={[-geometrySettings.radius + geometrySettings.textPadding, 0, geometrySettings.thickness + 0.01]}
        rotation={[0, 0, 0]}
        font='/fonts/BalsamiqSans-Bold.ttf'
      >
        {label.length < 24 ? label : label.substring(0, 24) + '...'}
      </Text>
      <mesh geometry={geometry} material={material}/>
    </group>
  );
}
