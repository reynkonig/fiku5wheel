import * as THREE from 'three';
import { damp3 } from 'maath/easing';
import { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { useFrame } from '@react-three/fiber';

import {
  GenerateSectorGeometryData
} from '../common/geometry/GenerateSectorGeometryData';

import store from '../common/stores/Store';

import Sector from './Sector';
import Pointer from './Pointer';
import OuterRing from './OuterRing';
import WinnerText from './WinnerText';



function Wheel({ ...props }: { [p: string]: any }) {

  const { labels } = store.wheel;
  const { palette, geometry } = store.settings;

  const [ hovered, setHovered ] = useState<boolean>(false);

  const sectorGeometryRef = useRef<THREE.BufferGeometry>(new THREE.BufferGeometry());
  const sectorMaterialARef = useRef<THREE.Material>(new THREE.MeshBasicMaterial({ color: palette.sectorA }));
  const sectorMaterialBRef = useRef<THREE.Material>(new THREE.MeshBasicMaterial( { color: palette.sectorB }));
  const sectorMaterialCRef = useRef<THREE.Material>(new THREE.MeshBasicMaterial({ color: palette.sectorC }));
  const outlineMaterialRef = useRef<THREE.Material>(new THREE.MeshBasicMaterial( { color: palette.outline }));

  const rotatablePartRef = useRef<THREE.Group>(null!);
  const totalTransformRef = useRef<THREE.Group>(null!);

  const getCurrentAngle = () => (360 - (rotatablePartRef.current.rotation.z * 180 / Math.PI));

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
  }, [hovered])

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
      const scale = new Array(3).fill(hovered ? 1.05 : 1) as [number, number, number];
      damp3(totalTransformRef.current.scale, scale, 0.15, delta, 1);
    }

    if(store.wheel.spinStateIndex !== 0) {
      rotatablePartRef.current.rotateZ(-store.wheel.velocity * delta);

      if(store.wheel.localProgress >= 1) {
        store.wheel.switchToNextSpinState(getCurrentAngle());
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
        store.wheel.switchSpinState(getCurrentAngle());
        event.stopPropagation();
      } }
      {...props}
    >
      <WinnerText />
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
              rotation={[0, 0, i * 360 / labels.length * Math.PI / 180]}
            />
          ))
        }</group >
    </group>
  );
}

export default observer(Wheel)
