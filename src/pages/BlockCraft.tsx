import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Box, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { Hands, Landmark } from '@mediapipe/hands';

// 积木类型定义
interface Block {
  id: string;
  type: 'cube' | 'sphere' | 'cylinder';
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  color: string;
}

const BlockCraft = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<'select' | 'cube' | 'sphere' | 'cylinder'>('select');
  const [color, setColor] = useState('#3b82f6');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [handLandmarks, setHandLandmarks] = useState<Landmark[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hands = useRef<Hands | null>(null);
  
  // 初始化MediaPipe Hands
  useEffect(() => {
    const initHands = async () => {
      const { Hands } = await import('@mediapipe/hands');
      
      hands.current = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });
      
      hands.current.setOptions({
        maxNumHands: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      
      hands.current.onResults((results) => {
        if (results.multiHandLandmarks && results.multiHandLandmarks[0]) {
          setHandLandmarks(results.multiHandLandmarks[0]);
        } else {
          setHandLandmarks([]);
        }
      });
      
      if (videoRef.current) {
        // 使用navigator.mediaDevices获取摄像头
        navigator.mediaDevices.getUserMedia({ video: true })
          .then((stream) => {
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.play();
              setIsCameraActive(true);
              
              // 手动处理帧
              const processFrame = async () => {
                if (hands.current && videoRef.current && !videoRef.current.paused && !videoRef.current.ended) {
                  await hands.current.send({ image: videoRef.current });
                }
                requestAnimationFrame(processFrame);
              };
              
              processFrame();
            }
          })
          .catch((error) => {
            console.error('Error accessing camera:', error);
          });
      }
    };
    
    initHands();
  }, []);
  
  // 添加积木
  const addBlock = (type: 'cube' | 'sphere' | 'cylinder') => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      color,
    };
    setBlocks([...blocks, newBlock]);
    setSelectedBlock(newBlock.id);
  };
  
  // 删除积木
  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
    if (selectedBlock === id) {
      setSelectedBlock(null);
    }
  };
  
  // 更新积木属性
  const updateBlock = (id: string, updates: Partial<Block>) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ));
  };
  
  // 渲染3D场景
  const Scene = () => {
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
  
  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white">
      {/* 顶部状态栏 */}
      <div className="h-10 bg-slate-800 flex items-center px-4 text-sm">
        <div className="mr-6">BlockCraft</div>
        <div className="mr-6">Mode: {activeTool}</div>
        <div className="mr-6">Blocks: {blocks.length}</div>
        <div className="mr-6">Camera: {isCameraActive ? 'Active' : 'Inactive'}</div>
        <div className="ml-auto">FPS: 60</div>
      </div>
      
      {/* 主内容区 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧工具栏 */}
        <div className="w-20 bg-slate-800 flex flex-col items-center py-4 space-y-4">
          <button 
            className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center ${activeTool === 'select' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'}`}
            onClick={() => setActiveTool('select')}
          >
            <span className="text-xl">👆</span>
            <span className="text-xs mt-1">Select</span>
          </button>
          <button 
            className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center ${activeTool === 'cube' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'}`}
            onClick={() => {
              setActiveTool('cube');
              addBlock('cube');
            }}
          >
            <span className="text-xl">📦</span>
            <span className="text-xs mt-1">Cube</span>
          </button>
          <button 
            className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center ${activeTool === 'sphere' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'}`}
            onClick={() => {
              setActiveTool('sphere');
              addBlock('sphere');
            }}
          >
            <span className="text-xl">🔵</span>
            <span className="text-xs mt-1">Sphere</span>
          </button>
          <button 
            className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center ${activeTool === 'cylinder' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'}`}
            onClick={() => {
              setActiveTool('cylinder');
              addBlock('cylinder');
            }}
          >
            <span className="text-xl">🔷</span>
            <span className="text-xs mt-1">Cylinder</span>
          </button>
        </div>
        
        {/* 3D工作区 */}
        <div className="flex-1 relative">
          <Canvas className="w-full h-full">
            <Scene />
          </Canvas>
          
          {/* 手势识别指示器 */}
          {handLandmarks.length > 0 && (
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 p-2 rounded">
              <div className="text-sm">Hand Detected</div>
            </div>
          )}
        </div>
        
        {/* 右侧属性面板 */}
        <div className="w-64 bg-slate-800 p-4 overflow-y-auto">
          <h3 className="text-lg font-medium mb-4">Properties</h3>
          
          {selectedBlock ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Color</label>
                <input 
                  type="color" 
                  value={color} 
                  onChange={(e) => {
                    setColor(e.target.value);
                    if (selectedBlock) {
                      updateBlock(selectedBlock, { color: e.target.value });
                    }
                  }}
                  className="w-full h-8 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Position</label>
                {blocks.find(b => b.id === selectedBlock) && (
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs">X</label>
                      <input 
                        type="number" 
                        value={blocks.find(b => b.id === selectedBlock)?.position.x || 0}
                        onChange={(e) => updateBlock(selectedBlock, {
                          position: {
                            ...(blocks.find(b => b.id === selectedBlock)?.position || { x: 0, y: 0, z: 0 }),
                            x: parseFloat(e.target.value) || 0
                          }
                        })}
                        className="w-full bg-slate-700 text-white p-1 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs">Y</label>
                      <input 
                        type="number" 
                        value={blocks.find(b => b.id === selectedBlock)?.position.y || 0}
                        onChange={(e) => updateBlock(selectedBlock, {
                          position: {
                            ...(blocks.find(b => b.id === selectedBlock)?.position || { x: 0, y: 0, z: 0 }),
                            y: parseFloat(e.target.value) || 0
                          }
                        })}
                        className="w-full bg-slate-700 text-white p-1 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs">Z</label>
                      <input 
                        type="number" 
                        value={blocks.find(b => b.id === selectedBlock)?.position.z || 0}
                        onChange={(e) => updateBlock(selectedBlock, {
                          position: {
                            ...(blocks.find(b => b.id === selectedBlock)?.position || { x: 0, y: 0, z: 0 }),
                            z: parseFloat(e.target.value) || 0
                          }
                        })}
                        className="w-full bg-slate-700 text-white p-1 rounded text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm mb-1">Rotation</label>
                {blocks.find(b => b.id === selectedBlock) && (
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs">X</label>
                      <input 
                        type="number" 
                        value={blocks.find(b => b.id === selectedBlock)?.rotation.x || 0}
                        onChange={(e) => updateBlock(selectedBlock, {
                          rotation: {
                            ...(blocks.find(b => b.id === selectedBlock)?.rotation || { x: 0, y: 0, z: 0 }),
                            x: parseFloat(e.target.value) || 0
                          }
                        })}
                        className="w-full bg-slate-700 text-white p-1 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs">Y</label>
                      <input 
                        type="number" 
                        value={blocks.find(b => b.id === selectedBlock)?.rotation.y || 0}
                        onChange={(e) => updateBlock(selectedBlock, {
                          rotation: {
                            ...(blocks.find(b => b.id === selectedBlock)?.rotation || { x: 0, y: 0, z: 0 }),
                            y: parseFloat(e.target.value) || 0
                          }
                        })}
                        className="w-full bg-slate-700 text-white p-1 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs">Z</label>
                      <input 
                        type="number" 
                        value={blocks.find(b => b.id === selectedBlock)?.rotation.z || 0}
                        onChange={(e) => updateBlock(selectedBlock, {
                          rotation: {
                            ...(blocks.find(b => b.id === selectedBlock)?.rotation || { x: 0, y: 0, z: 0 }),
                            z: parseFloat(e.target.value) || 0
                          }
                        })}
                        className="w-full bg-slate-700 text-white p-1 rounded text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm mb-1">Scale</label>
                {blocks.find(b => b.id === selectedBlock) && (
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs">X</label>
                      <input 
                        type="number" 
                        value={blocks.find(b => b.id === selectedBlock)?.scale.x || 1}
                        onChange={(e) => updateBlock(selectedBlock, {
                          scale: {
                            ...(blocks.find(b => b.id === selectedBlock)?.scale || { x: 1, y: 1, z: 1 }),
                            x: parseFloat(e.target.value) || 1
                          }
                        })}
                        className="w-full bg-slate-700 text-white p-1 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs">Y</label>
                      <input 
                        type="number" 
                        value={blocks.find(b => b.id === selectedBlock)?.scale.y || 1}
                        onChange={(e) => updateBlock(selectedBlock, {
                          scale: {
                            ...(blocks.find(b => b.id === selectedBlock)?.scale || { x: 1, y: 1, z: 1 }),
                            y: parseFloat(e.target.value) || 1
                          }
                        })}
                        className="w-full bg-slate-700 text-white p-1 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs">Z</label>
                      <input 
                        type="number" 
                        value={blocks.find(b => b.id === selectedBlock)?.scale.z || 1}
                        onChange={(e) => updateBlock(selectedBlock, {
                          scale: {
                            ...(blocks.find(b => b.id === selectedBlock)?.scale || { x: 1, y: 1, z: 1 }),
                            z: parseFloat(e.target.value) || 1
                          }
                        })}
                        className="w-full bg-slate-700 text-white p-1 rounded text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                className="w-full bg-red-600 hover:bg-red-700 py-2 rounded text-sm"
                onClick={() => selectedBlock && deleteBlock(selectedBlock)}
              >
                Delete Block
              </button>
            </div>
          ) : (
            <div className="text-slate-400 text-sm">Select a block to edit</div>
          )}
        </div>
      </div>
      
      {/* 底部视频捕捉区域 */}
      <div className="h-48 bg-slate-800 flex items-center justify-end p-4">
        <div className="w-64 h-40 bg-black rounded-lg overflow-hidden">
          {isCameraActive ? (
            <video 
              ref={videoRef} 
              className="w-full h-full object-cover"
              autoPlay 
              playsInline 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500">
              Camera not active
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockCraft;