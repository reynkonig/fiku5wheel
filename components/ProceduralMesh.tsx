import _ from 'lodash';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useEffect, useRef } from 'react';

export interface IProceduralMeshProps {
  vertices: number[];
  triangles?: number[];
}

export default function ProceduralMesh({ vertices, triangles }: IProceduralMeshProps) {
  const materialRef = useRef(new THREE.MeshBasicMaterial({ color: 'red', wireframe: false }));
  const geometryRef = useRef(new THREE.BufferGeometry());

  useEffect(() => {
    if(geometryRef.current) {
      geometryRef.current.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(
          vertices,
          3
        )
      );
      if (triangles) {
        geometryRef.current.setIndex(triangles);
      }
    }
  }, [vertices, triangles])

  return (
    <group>
    <mesh
      geometry={geometryRef.current}
      material={materialRef.current}
    />
    <group>
      {
        _.map(_.chunk(vertices, 3),(position, index) => {
          return (
            <mesh
              key={index}
              material={materialRef.current}
              position={position as [number, number, number]}
              scale={0.01}
            >
              <sphereGeometry />
              <Html sprite>
                <span className="select-none">{index}</span>
              </Html>
            </mesh>
          );
        })
      }
    </group>
    </group>
  );
}
