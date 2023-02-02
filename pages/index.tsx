import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, } from '@react-three/drei';


import VideoBackground from '../components/VideoBackground';

import Wheel from '../components/Wheel';
import Panel from '../components/ui/Panel';

export default function Home() {
  return (
    <div className="flex w-screen h-screen">
      <Panel />
      <Suspense fallback={null}>
        <Canvas className="w-screen h-screen">
          <Wheel />
          <pointLight position={[0, 5, 5]} intensity={1}/>
          <PerspectiveCamera
            position={[0, 0, 5.5]}
            makeDefault
          />
          <VideoBackground />
        </Canvas>
      </Suspense>
    </div>
  )
}
