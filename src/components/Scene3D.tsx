import { useEffect, memo } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Box, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { Block } from '@/store/blockcraftStore';

interface Scene3DProps {
  blocks: Block[];
  selectedBlock: string | null;
}

// 单个积木组件，使用memo避免不必要的重渲染
const BlockComponent = memo(({ block, selectedBlock }: { block: Block; selectedBlock: string | null }) => {
  // 品牌颜色
  const accentOrange = '#d97757'; // --color-orange

  return (
    <group
      position={[block.position.x, block.position.y, block.position.z]}
      rotation={[block.rotation.x, block.rotation.y, block.rotation.z]}
    >
      {block.type === 'cube' && (
        <Box
          args={[block.scale.x, block.scale.y, block.scale.z]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color={selectedBlock === block.id ? accentOrange : block.color}
            metalness={0.3}
            roughness={0.5}
            emissive={selectedBlock === block.id ? accentOrange : 'black'}
            emissiveIntensity={selectedBlock === block.id ? 0.3 : 0}
          />
        </Box>
      )}
      {block.type === 'sphere' && (
        <Sphere
          args={[block.scale.x / 2, 32, 32]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color={selectedBlock === block.id ? accentOrange : block.color}
            metalness={0.3}
            roughness={0.5}
            emissive={selectedBlock === block.id ? accentOrange : 'black'}
            emissiveIntensity={selectedBlock === block.id ? 0.3 : 0}
          />
        </Sphere>
      )}
      {block.type === 'cylinder' && (
        <Cylinder
          args={[block.scale.x / 2, block.scale.x / 2, block.scale.y, 32]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color={selectedBlock === block.id ? accentOrange : block.color}
            metalness={0.3}
            roughness={0.5}
            emissive={selectedBlock === block.id ? accentOrange : 'black'}
            emissiveIntensity={selectedBlock === block.id ? 0.3 : 0}
          />
        </Cylinder>
      )}
    </group>
  );
});

const Scene3D: React.FC<Scene3DProps> = memo(({ blocks, selectedBlock }) => {
  const { camera, gl } = useThree();

  // 初始相机位置
  useEffect(() => {
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  // 启用阴影
  useEffect(() => {
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
  }, [gl]);

  // 品牌颜色
  const midGray = '#b0aea5'; // --color-mid-gray
  const lightGray = '#e8e6dc'; // --color-light-gray

  return (
    <>
      <OrbitControls 
        enableDamping 
        dampingFactor={0.05}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={15}
      />
      <Grid 
        args={[10, 10]} 
        material-color={midGray}
        material-opacity={0.5}
        position={[0, -0.5, 0]}
      />
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight 
        position={[-5, 10, -5]} 
        intensity={0.4}
      />

      {/* 渲染积木 */}
      {blocks.map(block => (
        <BlockComponent 
          key={block.id} 
          block={block} 
          selectedBlock={selectedBlock} 
        />
      ))}
    </>
  );
});

export default Scene3D;