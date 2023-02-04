import { useRef } from 'react';

import { observer } from 'mobx-react';

import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { damp } from 'maath/easing';

import store from '../common/stores/Store';


function WinnerText() {
  const textMaterialRef = useRef<THREE.MeshBasicMaterial>(null!);

  useFrame((state, delta) => {
    damp(textMaterialRef.current, 'opacity', store.wheel.isSpinning ? 0 : 1, 0.05, delta, 5);
  });

  return (
    <Text
      anchorX="center"
      anchorY="middle"
      fontSize={0.2}
      color={store.session.winner?.userstate?.color ?? 'white'}
      outlineWidth={0.005}
      position={[0, 0, store.settings.geometry.thickness * 1.5]}
    >
      {store.session.winner?.label ?? ''}
      <meshBasicMaterial ref={textMaterialRef} />
    </Text>
  )
}

export default observer(WinnerText);
