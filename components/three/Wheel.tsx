import _ from 'lodash';
import * as THREE from 'three';
import { lerp } from 'maath/misc';
import { damp3 } from 'maath/easing';

import React, { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';

import { useAtomValue, useSetAtom } from 'jotai';

import {
  GenerateSectorGeometryData
} from '../../common/geometry/GenerateSectorGeometryData';

import { itemLabelsAtom, winnerLabelAtom } from '../../atoms/ItemAtoms';
import {
  geometrySettingsAtom,
  paletteAtom, spinSettingsAtom,
} from '../../atoms/SettingsAtoms';

import Sector from './Sector';
import WinnerText from './WinnerText';
import ProceduralMesh from './ProceduralMesh';

import GenerateRingGeometryData
  from '../../common/geometry/GenerateRingGeometryData';
import GeneratePointerGeometryData
  from '../../common/geometry/GeneratePointerGeometryData';


export default function Wheel({ ...props }: { [p: string]: any }) {

  const spinRandomRef = useRef(0);
  const spinStartTimeRef = useRef(0);
  const spinStateIndexRef = useRef(0);

  const labels = useAtomValue(itemLabelsAtom);

  const palette = useAtomValue(paletteAtom);
  const geometry = useAtomValue(geometrySettingsAtom);
  const spinSettings = useAtomValue(spinSettingsAtom);

  const setWinner = useSetAtom(winnerLabelAtom)

  const [ hovered, setHovered ] = useState<boolean>(false);

  const sectorGeometryRef = useRef<THREE.BufferGeometry>(new THREE.BufferGeometry());
  const sectorMaterialARef = useRef<THREE.Material>(new THREE.MeshBasicMaterial({ color: palette.sectorA }));
  const sectorMaterialBRef = useRef<THREE.Material>(new THREE.MeshBasicMaterial({ color: palette.sectorB }));
  const sectorMaterialCRef = useRef<THREE.Material>(new THREE.MeshBasicMaterial({ color: palette.sectorC }));
  const outlineMaterialRef = useRef<THREE.Material>(new THREE.MeshBasicMaterial({ color: palette.outline }));

  const rotatablePartRef = useRef<THREE.Group>(null!);
  const totalTransformRef = useRef<THREE.Group>(null!);

  const setSpinStage = (newStateIndex: number) => {
    if(newStateIndex === 1) {
      spinRandomRef.current = Math.random();
      spinStartTimeRef.current = Date.now();
    }

    if(newStateIndex === 0) {
      const angle = 360 - (rotatablePartRef.current.rotation.z * 180 / Math.PI);
      const stepAngle = 360 / labels.length;
      const rawWinnerIndex = Math.abs(Math.floor((angle + stepAngle / 2) / stepAngle));
      const normalizedWinnerIndex = rawWinnerIndex >= labels.length
        ? rawWinnerIndex - labels.length
        : rawWinnerIndex;
      const winner = labels[normalizedWinnerIndex];
      setWinner(winner);
    }

    spinStateIndexRef.current = newStateIndex;
  }

  const setNextSpinStage = () => {
    const nextStageIndex = spinStateIndexRef.current + 1;

    setSpinStage(nextStageIndex < spinSettings.stages.length ? nextStageIndex : 0);
  }

  const switchSpinState = () => {
    setSpinStage(spinStateIndexRef.current === 0 ? 1 : 0)
  }

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
  }, [ hovered ])

  useEffect(() => {
    if (sectorGeometryRef.current) {
      const geometryData = GenerateSectorGeometryData({
        radius: geometry.radius,
        angle: 360 / labels.length,
        resolution: 3,
        depth: geometry.thickness
      });

      sectorGeometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute(geometryData.vertices, 3));
      sectorGeometryRef.current.setIndex(geometryData.triangles as number[]);

      sectorGeometryRef.current.attributes.position.needsUpdate = true;

      sectorGeometryRef.current.computeBoundingBox();
      sectorGeometryRef.current.computeBoundingSphere();
    }
  }, [ geometry, labels ]);

  useFrame((state, delta) => {
    if (totalTransformRef.current) {
      const scale = new Array(3).fill(hovered ? 1.05 : 1) as [ number, number, number ];
      damp3(totalTransformRef.current.scale, scale, 0.15, delta, 1);
    }

    const { stages } = spinSettings;
    const { current: stageIndex } = spinStateIndexRef;

    if (stageIndex !== 0) {
      const pass = (Date.now() - spinStartTimeRef.current);
      const total = (spinSettings.duration * 1000);
      const totalProgress = _.clamp(pass / total, 0, 1);

      const preStage = stages[stageIndex - 1];
      const curStage = stages[stageIndex];
      const nextStage = stages[stageIndex + 1 < stages.length ? stageIndex + 1 : 0];

      const curTiming: number = curStage.timing;
      const nextTiming: number = nextStage.timing === 0
        ? 1
        : nextStage.timing
      ;

      const stageProgress = _.clamp((totalProgress - curTiming) / (nextTiming - curTiming), 0, 1);

      const { velocityPercent, easing } = curStage;
      const easedLocalProgress = easing ? easing(stageProgress) : stageProgress
      const randomizedMaxVelocity = spinSettings.maxVelocity + spinRandomRef.current * 5;
      const velocity = lerp(
        preStage.velocityPercent * randomizedMaxVelocity,
        velocityPercent * randomizedMaxVelocity,
        easedLocalProgress
      );

      rotatablePartRef.current.rotateZ(-velocity * delta);

      if (stageProgress >= 1) {
        setNextSpinStage();
      }
    }

    totalTransformRef.current.rotation.y = state.mouse.x / 2.5;
    totalTransformRef.current.rotation.x = -state.mouse.y / 2.5;

  });

  return (
    <group
      ref={totalTransformRef}
      onPointerOver={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={(event) => {
        switchSpinState();
        event.stopPropagation();
      }}
      {...props}
    >
      <WinnerText/>
      <group
        name="pointer"
        position={[ -geometry.radius, 0, geometry.thickness ]}
      >
        <ProceduralMesh
          generator={GeneratePointerGeometryData}
          material={outlineMaterialRef.current}
        />
      </group>
      <group name="outer-ring">
        <ProceduralMesh
          generator={GenerateRingGeometryData}
          material={outlineMaterialRef.current}
        />
      </group>
      <mesh
        material={outlineMaterialRef.current}
        position={[ 0, 0, geometry.thickness ]}
        rotation={[ Math.PI / 2, 0, 0 ]}
      >
        <cylinderGeometry
          args={[
            geometry.radius * geometry.centerRadiusPercent,
            geometry.radius * geometry.centerRadiusPercent,
            geometry.pointerThickness
          ]}
        />
      </mesh>
      <group name="sectors" ref={rotatablePartRef}>{
        labels.map((label, i) => (
          <Sector
            key={label}
            label={label}
            geometry={sectorGeometryRef.current}
            material={
              i === 0
                ? sectorMaterialCRef.current
                : (
                  i % 2 === 0
                    ? sectorMaterialARef.current
                    : sectorMaterialBRef.current
                )
            }
            rotation={[ 0, 0, i * 360 / labels.length * Math.PI / 180 ]}
          />
        ))
      }</group>
    </group>
  );
}
