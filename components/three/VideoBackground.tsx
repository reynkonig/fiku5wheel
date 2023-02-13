import { useAspect, useVideoTexture } from '@react-three/drei';

export default function VideoBackground() {
  const size = useAspect(window.screen.width, window.screen.height, 25);
  const texture = useVideoTexture('/video/bg.webm', {});

  return (
    <mesh scale={size} position={[0, 0, -100]}>
      <planeGeometry/>
      <meshBasicMaterial map={texture} toneMapped={false}/>
    </mesh>
  );
}
