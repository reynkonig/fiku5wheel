import * as THREE from 'three';
import { useRef } from 'react';
import { damp } from 'maath/easing';

import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useAtomValue } from 'jotai';


import { winnerAtom } from '../atoms/ItemAtoms';
import { isSpinningAtom } from '../atoms/SessionAtoms';
import { geometrySettingsAtom } from '../atoms/SettingsAtoms';




export default function WinnerText() {
  const textMaterialRef = useRef<THREE.MeshBasicMaterial>(null!);

  const geometry = useAtomValue(geometrySettingsAtom);

  const winner = useAtomValue(winnerAtom);
  const isSpinning = useAtomValue(isSpinningAtom);

  useFrame((state, delta) => {
    damp(textMaterialRef.current, 'opacity', isSpinning ? 0 : 1, 0.05, delta, 5);
  });

  return (
    <Text
      anchorX="center"
      anchorY="middle"
      fontSize={0.2}
      color={winner?.userstate?.color ?? 'white'}
      outlineWidth={0.005}
      position={[0, 0, geometry.thickness * 1.5]}
    >
      {winner?.label ?? ''}
      <meshBasicMaterial ref={textMaterialRef} />
    </Text>
  )
}
