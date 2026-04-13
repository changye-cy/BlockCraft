import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Box, Sphere, Cylinder } from '@react-three/drei';
import { Block } from '@/store/blockcraftStore';

interface Scene3DProps {
  blocks: Block[];
  selectedBlock: string | null;
}

const Scene3D: React.FC<Scene3DProps> = ({ blocks, selectedBlock }) => {
  const { camera } = useThree();

  // 初始相机位置
  useEffect(() => {
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      <OrbitControls enableDamping dampingFactor={0.05} />
      <Grid args={[10, 10]} material-color="#444" />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
      <directionalLight position={[-5, 10, -5]} intensity={0.5} />
      <directionalLight position={[0, -10, 0]} intensity={0.2} />

      {/* 渲染积木 */}
      {blocks.map(block => (
        <group
          key={block.id}
          position={[block.position.x, block.position.y, block.position.z]}
          rotation={[block.rotation.x, block.rotation.y, block.rotation.z]}
        >
          {block.type === 'cube' && (
            <Box
              args={[block.scale.x, block.scale.y, block.scale.z]}
              material-color={selectedBlock === block.id ? '#f97316' : block.color}
            />
          )}
          {block.type === 'sphere' && (
            <Sphere
              args={[block.scale.x / 2, 32, 32]}
              material-color={selectedBlock === block.id ? '#f97316' : block.color}
            />
          )}
          {block.type === 'cylinder' && (
            <Cylinder
              args={[block.scale.x / 2, block.scale.x / 2, block.scale.y, 32]}
              material-color={selectedBlock === block.id ? '#f97316' : block.color}
            />
          )}
        </group>
      ))}
    </>
  );
};

export default Scene3D;