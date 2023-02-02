import * as THREE from 'three';
import { damp3 } from 'maath/easing';
import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';

import { observer } from 'mobx-react';

import {
  GenerateSectorGeometryData
} from '../common/geometry/GenerateSectorGeometryData';

import Sector from './Sector';
import Pointer from './Pointer';
import OuterRing from './OuterRing';

import store from '../common/stores/Store';
import { Text } from '@react-three/drei';


function Wheel({ ...props }: { [p: string]: any }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const labeledItems = store.session.labeledItems.length > 0 ? store.session.labeledItems : [ { label: '' } ]
  const { palette, geometry } = store.settings;

  const [ hovered, setHovered ] = useState<boolean>(false);

  const sectorGeometryRef = useRef<THREE.BufferGeometry>(new THREE.BufferGeometry());
  const sectorMaterialARef = useRef<THREE.Material>(new THREE.MeshBasicMaterial({ color: palette.sectorA }));
  const sectorMaterialBRef = useRef<THREE.Material>(new THREE.MeshBasicMaterial( { color: palette.sectorB }));
  const sectorMaterialCRef = useRef<THREE.Material>(new THREE.MeshBasicMaterial({ color: palette.sectorC }));
  const outlineMaterialRef = useRef<THREE.Material>(new THREE.MeshBasicMaterial( { color: palette.outline }));

  const rotatablePartRef = useRef<THREE.Group>(null!);
  const totalTransformRef = useRef<THREE.Group>(null!);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
  }, [hovered])

  useEffect(() => {
    if (sectorGeometryRef.current) {
      const geometryData = GenerateSectorGeometryData({
        radius: geometry.radius,
        angle: 360 / labeledItems.length,
        resolution: 3,
        depth: geometry.thickness
      });

      sectorGeometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute(geometryData.vertices, 3));
      sectorGeometryRef.current.setIndex(geometryData.triangles as number[]);

      sectorGeometryRef.current.attributes.position.needsUpdate = true;

      if(sectorGeometryRef.current.index !== null) {
        sectorGeometryRef.current.index.needsUpdate = true;
      }

      sectorGeometryRef.current.computeBoundingBox();
      sectorGeometryRef.current.computeBoundingSphere();
    }
  }, [ geometry, labeledItems ]);

  useFrame((state, delta, frame) => {
    if (totalTransformRef.current) {
      const scale = new Array(3).fill(hovered ? 1.05 : 1) as [number, number, number];
      damp3(totalTransformRef.current.scale, scale, 0.15, delta, 1);
    }

    if(store.wheel.spinStateIndex !== 0) {
      rotatablePartRef.current.rotateZ(-store.wheel.velocity * delta);

      if(store.wheel.localProgress >= 1) {
        store.wheel.switchToNextSpinState();
      }
    }
    else {
      const angle = 360 - (rotatablePartRef.current.rotation.z * 180 / Math.PI);
      const stepAngle = 360 / labeledItems.length;
      const i = Math.abs(Math.floor((angle + stepAngle / 2) / stepAngle));
      const winner = labeledItems[i >= labeledItems.length ? i - labeledItems.length : i];
      store.session.setWinner(winner);
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
        store.wheel.switchSpinState();
        event.stopPropagation();
      } }
      {...props}
    >
      <Text
        anchorX="center"
        anchorY="middle"
        fontSize={0.2}
        color={store.session.winner.userstate?.color ?? 'white'}
        outlineWidth={0.005}
        position={[0, 0, 0.5]}
      >
        {store.session.winner.label}
      </Text>
      <Pointer
        material={outlineMaterialRef.current}
        position={[-geometry.radius, 0, geometry.thickness]}
      />
      <OuterRing
        material={outlineMaterialRef.current}
      />
      <mesh
        material={outlineMaterialRef.current}
        position={[0, 0, geometry.thickness]}
        rotation={[Math.PI / 2, 0, 0]}
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
          labeledItems.map((item, i) => (
            <Sector
              key={item.label}
              label={item.label}
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
              rotation={[0, 0, i * 360 / labeledItems.length * Math.PI / 180]}
            />
          ))
        }</group >
    </group>
  );
}

export default observer(Wheel)
