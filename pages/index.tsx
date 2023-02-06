import React from 'react';

import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';

import Wheel from '../components/Wheel';
import VideoBackground from '../components/VideoBackground';

import Panel from '../components/ui/Panel';
import TwitchLoader from '../components/ui/TwitchLoader';


export default function Index() {
  return (
    <div className="flex w-screen h-screen font-bold">
      <TwitchLoader />
      <Panel />
      <Canvas className="w-screen h-screen">
        <Wheel />
        <pointLight position={[0, 5, 5]} intensity={1}/>
        <PerspectiveCamera
          position={[0, 0, 5.5]}
          makeDefault
        />
        <VideoBackground />
      </Canvas>
    </div>
  );
}
