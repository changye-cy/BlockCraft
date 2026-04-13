import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useBlockCraftStore, Block } from '@/store/blockcraftStore';
import GestureRecognition from '@/components/GestureRecognition';
import Scene3D from '@/components/Scene3D';
import Notification from '@/components/Notification';
import AlgorithmicBackground from '@/components/AlgorithmicBackground';

const BlockCraft = () => {
  // 从store获取状态
  const {
    blocks,
    selectedBlock,
    activeTool,
    color,
    isCameraActive,
    handLandmarks,
    error,
    addBlock,
    deleteBlock,
    updateBlock,
    setActiveTool,
    setColor,
    setIsCameraActive,
    setHandLandmarks,
    setError,
    selectBlock,
    scenes,
    currentScene,
    saveScene,
    loadScene,
    deleteScene,
  } = useBlockCraftStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [sceneName, setSceneName] = useState('');
  const [fps, setFps] = useState(0);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const lastFrameTime = useRef<number>(Date.now());
  const frameCount = useRef<number>(0);
  const fpsUpdateInterval = useRef<number>(1000); // 每秒更新一次FPS
  
  // 模拟加载时间
  useEffect(() => {
    console.log('Initializing BlockCraft...');
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // 处理手势识别结果
  const handleHandLandmarks = (landmarks: any[]) => {
    setHandLandmarks(landmarks);
    if (landmarks.length > 0) {
      analyzeGesture(landmarks);
    }
  };
  
  // FPS监控
  useEffect(() => {
    const calculateFps = () => {
      const now = Date.now();
      const delta = now - lastFrameTime.current;
      frameCount.current++;
      
      if (delta >= fpsUpdateInterval.current) {
        const currentFps = Math.round((frameCount.current * 1000) / delta);
        setFps(currentFps);
        frameCount.current = 0;
        lastFrameTime.current = now;
      }
      
      requestAnimationFrame(calculateFps);
    };
    
    const animationId = requestAnimationFrame(calculateFps);
    
    return () => cancelAnimationFrame(animationId);
  }, []);
  
  // 分析手势并执行相应操作
  const analyzeGesture = (landmarks: any[]) => {
    if (landmarks.length < 21) return;
    
    // 获取手指关键点
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];
    
    // 计算手指之间的距离
    const getDistance = (p1: any, p2: any) => {
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      return Math.sqrt(dx * dx + dy * dy);
    };
    
    // 计算手指是否伸直
    const isFingerExtended = (tip: any, pip: any, mcp: any) => {
      const tipPipDist = getDistance(tip, pip);
      const pipMcpDist = getDistance(pip, mcp);
      return tipPipDist > pipMcpDist * 0.8;
    };
    
    // 识别手势
    const indexExtended = isFingerExtended(indexTip, landmarks[7], landmarks[5]);
    const middleExtended = isFingerExtended(middleTip, landmarks[11], landmarks[9]);
    const ringExtended = isFingerExtended(ringTip, landmarks[15], landmarks[13]);
    const pinkyExtended = isFingerExtended(pinkyTip, landmarks[19], landmarks[17]);
    
    // 1. 选择手势（仅食指伸直）
    if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
      // 实现选择功能
      console.log('Select gesture detected');
      // 可以根据食指位置实现选择逻辑
    }
    
    // 2. 放置积木手势（食指和中指伸直）
    if (indexExtended && middleExtended && !ringExtended && !pinkyExtended) {
      // 实现放置积木功能
      console.log('Place block gesture detected');
      // 根据当前激活的工具放置相应类型的积木
      if (activeTool === 'cube') {
        addBlock('cube');
        setNotification({ message: 'Cube added successfully', type: 'success' });
        setTimeout(() => setNotification(null), 2000);
      } else if (activeTool === 'sphere') {
        addBlock('sphere');
        setNotification({ message: 'Sphere added successfully', type: 'success' });
        setTimeout(() => setNotification(null), 2000);
      } else if (activeTool === 'cylinder') {
        addBlock('cylinder');
        setNotification({ message: 'Cylinder added successfully', type: 'success' });
        setTimeout(() => setNotification(null), 2000);
      }
    }
    
    // 3. 旋转手势（食指、中指和无名指伸直）
    if (indexExtended && middleExtended && ringExtended && !pinkyExtended) {
      // 实现旋转功能
      console.log('Rotate gesture detected');
      // 旋转选中的积木
      if (selectedBlock) {
        updateBlock(selectedBlock, {
          rotation: {
            x: Math.random() * Math.PI * 2,
            y: Math.random() * Math.PI * 2,
            z: Math.random() * Math.PI * 2
          }
        });
        setNotification({ message: 'Block rotated successfully', type: 'success' });
        setTimeout(() => setNotification(null), 2000);
      }
    }
    
    // 4. 缩放手势（所有手指伸直）
    if (indexExtended && middleExtended && ringExtended && pinkyExtended) {
      // 实现缩放功能
      console.log('Scale gesture detected');
      // 缩放选中的积木
      if (selectedBlock) {
        const randomScale = 0.5 + Math.random();
        updateBlock(selectedBlock, {
          scale: {
            x: randomScale,
            y: randomScale,
            z: randomScale
          }
        });
        setNotification({ message: 'Block scaled successfully', type: 'success' });
        setTimeout(() => setNotification(null), 2000);
      }
    }
    
    // 5. 删除手势（仅拇指伸直）
    if (!indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
      // 实现删除功能
      console.log('Delete gesture detected');
      // 删除选中的积木
      if (selectedBlock) {
        deleteBlock(selectedBlock);
        setNotification({ message: 'Block deleted successfully', type: 'success' });
        setTimeout(() => setNotification(null), 2000);
      }
    }
  };


  
  return (
    <div className="flex flex-col h-screen bg-primary text-primary relative overflow-hidden">
      {/* 算法艺术背景 */}
      <AlgorithmicBackground />
      
      {/* 顶部状态栏 */}
      <div className="h-10 bg-secondary/80 backdrop-blur-sm flex items-center px-4 text-sm z-10 overflow-x-auto">
        <div className="mr-6 font-semibold text-primary whitespace-nowrap">BlockCraft</div>
        <div className="mr-6 text-primary whitespace-nowrap">Mode: {activeTool}</div>
        <div className="mr-6 text-primary whitespace-nowrap">Blocks: {blocks.length}</div>
        <div className="mr-6 text-primary whitespace-nowrap">FPS: {fps}</div>
        <div className="mr-6 text-primary whitespace-nowrap">Camera: {isCameraActive ? 'Active' : 'Inactive'}</div>
        {error && <div className="ml-auto text-accent-orange whitespace-nowrap">{error}</div>}
        {isLoading && <div className="ml-auto text-accent-blue whitespace-nowrap">Loading...</div>}
      </div>
      
      {/* 主内容区 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧工具栏 */}
        <div className="w-20 md:w-24 bg-secondary/80 backdrop-blur-sm flex flex-col items-center py-4 space-y-4 z-10 transition-all duration-300">
          <button 
            className={`w-16 h-16 md:w-20 md:h-20 rounded-lg flex flex-col items-center justify-center transition-all duration-200 transform hover:scale-105 ${activeTool === 'select' ? 'bg-accent-blue text-primary' : 'bg-mid-gray/30 hover:bg-mid-gray/50 text-primary'}`}
            onClick={() => setActiveTool('select')}
            title="Select"
          >
            <span className="text-xl md:text-2xl">👆</span>
            <span className="text-xs md:text-sm mt-1">Select</span>
          </button>
          <button 
            className={`w-16 h-16 md:w-20 md:h-20 rounded-lg flex flex-col items-center justify-center transition-all duration-200 transform hover:scale-105 ${activeTool === 'cube' ? 'bg-accent-orange text-primary' : 'bg-mid-gray/30 hover:bg-mid-gray/50 text-primary'}`}
            onClick={() => {
              setActiveTool('cube');
              addBlock('cube');
            }}
            title="Cube"
          >
            <span className="text-xl md:text-2xl">📦</span>
            <span className="text-xs md:text-sm mt-1">Cube</span>
          </button>
          <button 
            className={`w-16 h-16 md:w-20 md:h-20 rounded-lg flex flex-col items-center justify-center transition-all duration-200 transform hover:scale-105 ${activeTool === 'sphere' ? 'bg-accent-green text-primary' : 'bg-mid-gray/30 hover:bg-mid-gray/50 text-primary'}`}
            onClick={() => {
              setActiveTool('sphere');
              addBlock('sphere');
            }}
            title="Sphere"
          >
            <span className="text-xl md:text-2xl">🔵</span>
            <span className="text-xs md:text-sm mt-1">Sphere</span>
          </button>
          <button 
            className={`w-16 h-16 md:w-20 md:h-20 rounded-lg flex flex-col items-center justify-center transition-all duration-200 transform hover:scale-105 ${activeTool === 'cylinder' ? 'bg-accent-blue text-primary' : 'bg-mid-gray/30 hover:bg-mid-gray/50 text-primary'}`}
            onClick={() => {
              setActiveTool('cylinder');
              addBlock('cylinder');
            }}
            title="Cylinder"
          >
            <span className="text-xl md:text-2xl">🔷</span>
            <span className="text-xs md:text-sm mt-1">Cylinder</span>
          </button>
          <button 
            className="w-16 h-16 md:w-20 md:h-20 rounded-lg flex flex-col items-center justify-center bg-mid-gray/30 hover:bg-mid-gray/50 text-primary transition-all duration-200 transform hover:scale-105"
            onClick={() => setShowSaveDialog(true)}
            title="Save"
          >
            <span className="text-xl md:text-2xl">💾</span>
            <span className="text-xs md:text-sm mt-1">Save</span>
          </button>
          <button 
            className="w-16 h-16 md:w-20 md:h-20 rounded-lg flex flex-col items-center justify-center bg-mid-gray/30 hover:bg-mid-gray/50 text-primary transition-all duration-200 transform hover:scale-105"
            onClick={() => setShowLoadDialog(true)}
            title="Load"
          >
            <span className="text-xl md:text-2xl">📁</span>
            <span className="text-xs md:text-sm mt-1">Load</span>
          </button>
        </div>
        
        {/* 3D工作区 */}
        <div className="flex-1 relative bg-light-gray flex items-center justify-center">
          <div className="text-primary text-lg">3D Scene (Temporarily Disabled)</div>
          
          {/* 手势识别指示器 */}
          {handLandmarks.length > 0 && (
            <div className="absolute top-4 left-4 bg-secondary/80 backdrop-blur-sm p-2 rounded border border-mid-gray/50 shadow-md">
              <div className="text-sm text-primary">Hand Detected</div>
            </div>
          )}
        </div>
        
        {/* 右侧属性面板 - 响应式 */}
        <div className="w-64 bg-secondary/80 backdrop-blur-sm p-4 overflow-y-auto z-10 transition-all duration-300 md:transition-none">
          <h3 className="text-lg font-medium mb-4 text-primary">Properties</h3>
          
          {selectedBlock ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-primary">Color</label>
                <input 
                  type="color" 
                  value={color} 
                  onChange={(e) => {
                    setColor(e.target.value);
                    if (selectedBlock) {
                      updateBlock(selectedBlock, { color: e.target.value });
                    }
                  }}
                  className="w-full h-8 rounded transition-all duration-200 transform hover:scale-105 border border-mid-gray/50"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1 text-primary">Position</label>
                {blocks.find(b => b.id === selectedBlock) && (
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-primary">X</label>
                      <input 
                        type="number" 
                        value={blocks.find(b => b.id === selectedBlock)?.position.x || 0}
                        onChange={(e) => updateBlock(selectedBlock, {
                          position: {
                            ...(blocks.find(b => b.id === selectedBlock)?.position || { x: 0, y: 0, z: 0 }),
                            x: parseFloat(e.target.value) || 0
                          }
                        })}
                        className="w-full bg-light-gray text-primary p-1 rounded text-sm transition-all duration-200 focus:ring-2 focus:ring-accent-blue border border-mid-gray/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-primary">Y</label>
                      <input 
                        type="number" 
                        value={blocks.find(b => b.id === selectedBlock)?.position.y || 0}
                        onChange={(e) => updateBlock(selectedBlock, {
                          position: {
                            ...(blocks.find(b => b.id === selectedBlock)?.position || { x: 0, y: 0, z: 0 }),
                            y: parseFloat(e.target.value) || 0
                          }
                        })}
                        className="w-full bg-light-gray text-primary p-1 rounded text-sm transition-all duration-200 focus:ring-2 focus:ring-accent-blue border border-mid-gray/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-primary">Z</label>
                      <input 
                        type="number" 
                        value={blocks.find(b => b.id === selectedBlock)?.position.z || 0}
                        onChange={(e) => updateBlock(selectedBlock, {
                          position: {
                            ...(blocks.find(b => b.id === selectedBlock)?.position || { x: 0, y: 0, z: 0 }),
                            z: parseFloat(e.target.value) || 0
                          }
                        })}
                        className="w-full bg-light-gray text-primary p-1 rounded text-sm transition-all duration-200 focus:ring-2 focus:ring-accent-blue border border-mid-gray/30"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm mb-1 text-primary">Rotation</label>
                {blocks.find(b => b.id === selectedBlock) && (
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-primary">X</label>
                      <input 
                        type="number" 
                        value={blocks.find(b => b.id === selectedBlock)?.rotation.x || 0}
                        onChange={(e) => updateBlock(selectedBlock, {
                          rotation: {
                            ...(blocks.find(b => b.id === selectedBlock)?.rotation || { x: 0, y: 0, z: 0 }),
                            x: parseFloat(e.target.value) || 0
                          }
                        })}
                        className="w-full bg-light-gray text-primary p-1 rounded text-sm transition-all duration-200 focus:ring-2 focus:ring-accent-blue border border-mid-gray/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-primary">Y</label>
                      <input 
                        type="number" 
                        value={blocks.find(b => b.id === selectedBlock)?.rotation.y || 0}
                        onChange={(e) => updateBlock(selectedBlock, {
                          rotation: {
                            ...(blocks.find(b => b.id === selectedBlock)?.rotation || { x: 0, y: 0, z: 0 }),
                            y: parseFloat(e.target.value) || 0
                          }
                        })}
                        className="w-full bg-light-gray text-primary p-1 rounded text-sm transition-all duration-200 focus:ring-2 focus:ring-accent-blue border border-mid-gray/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-primary">Z</label>
                      <input 
                        type="number" 
                        value={blocks.find(b => b.id === selectedBlock)?.rotation.z || 0}
                        onChange={(e) => updateBlock(selectedBlock, {
                          rotation: {
                            ...(blocks.find(b => b.id === selectedBlock)?.rotation || { x: 0, y: 0, z: 0 }),
                            z: parseFloat(e.target.value) || 0
                          }
                        })}
                        className="w-full bg-light-gray text-primary p-1 rounded text-sm transition-all duration-200 focus:ring-2 focus:ring-accent-blue border border-mid-gray/30"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm mb-1 text-primary">Scale</label>
                {blocks.find(b => b.id === selectedBlock) && (
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-primary">X</label>
                      <input 
                        type="number" 
                        value={blocks.find(b => b.id === selectedBlock)?.scale.x || 1}
                        onChange={(e) => updateBlock(selectedBlock, {
                          scale: {
                            ...(blocks.find(b => b.id === selectedBlock)?.scale || { x: 1, y: 1, z: 1 }),
                            x: parseFloat(e.target.value) || 1
                          }
                        })}
                        className="w-full bg-light-gray text-primary p-1 rounded text-sm transition-all duration-200 focus:ring-2 focus:ring-accent-blue border border-mid-gray/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-primary">Y</label>
                      <input 
                        type="number" 
                        value={blocks.find(b => b.id === selectedBlock)?.scale.y || 1}
                        onChange={(e) => updateBlock(selectedBlock, {
                          scale: {
                            ...(blocks.find(b => b.id === selectedBlock)?.scale || { x: 1, y: 1, z: 1 }),
                            y: parseFloat(e.target.value) || 1
                          }
                        })}
                        className="w-full bg-light-gray text-primary p-1 rounded text-sm transition-all duration-200 focus:ring-2 focus:ring-accent-blue border border-mid-gray/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-primary">Z</label>
                      <input 
                        type="number" 
                        value={blocks.find(b => b.id === selectedBlock)?.scale.z || 1}
                        onChange={(e) => updateBlock(selectedBlock, {
                          scale: {
                            ...(blocks.find(b => b.id === selectedBlock)?.scale || { x: 1, y: 1, z: 1 }),
                            z: parseFloat(e.target.value) || 1
                          }
                        })}
                        className="w-full bg-light-gray text-primary p-1 rounded text-sm transition-all duration-200 focus:ring-2 focus:ring-accent-blue border border-mid-gray/30"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                className="w-full bg-accent-orange text-primary hover:bg-accent-orange/80 py-2 rounded text-sm transition-all duration-200 transform hover:scale-95"
                onClick={() => {
                  if (selectedBlock) {
                    deleteBlock(selectedBlock);
                    setNotification({ message: 'Block deleted successfully', type: 'success' });
                    setTimeout(() => setNotification(null), 2000);
                  }
                }}
              >
                Delete Block
              </button>
            </div>
          ) : (
            <div className="text-mid-gray text-sm">Select a block to edit</div>
          )}
        </div>
      </div>
      
      {/* 底部视频捕捉区域 - 响应式 */}
      <div className="h-48 md:h-56 bg-secondary/80 backdrop-blur-sm flex items-center justify-end p-4 z-10 transition-all duration-300">
        <div className="rounded-lg overflow-hidden border-2 border-accent-blue/50 shadow-lg shadow-accent-blue/20 transform transition-all duration-300 hover:scale-105">
          <GestureRecognition
            onHandLandmarks={handleHandLandmarks}
            onError={setError}
            onCameraActive={setIsCameraActive}
          />
        </div>
      </div>
      
      {/* 保存对话框 */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-dark/50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
          <div className="bg-secondary/90 backdrop-blur-sm p-6 rounded-lg w-80 transform transition-transform duration-300 ease-in-out scale-100 opacity-100 border border-mid-gray/30 shadow-xl">
            <h3 className="text-lg font-medium mb-4 text-primary">Save Scene</h3>
            <div className="mb-4">
              <label className="block text-sm mb-1 text-primary">Scene Name</label>
              <input 
                type="text" 
                value={sceneName} 
                onChange={(e) => setSceneName(e.target.value)}
                className="w-full bg-light-gray text-primary p-2 rounded transition-all duration-200 focus:ring-2 focus:ring-accent-blue border border-mid-gray/30"
                placeholder="Enter scene name"
                autoFocus
              />
            </div>
            <div className="flex space-x-2">
              <button 
                className="flex-1 bg-accent-blue text-primary hover:bg-accent-blue/80 py-2 rounded transition-all duration-200 transform hover:scale-95"
                onClick={() => {
                  if (sceneName) {
                    saveScene(sceneName);
                    setShowSaveDialog(false);
                    setSceneName('');
                    setNotification({ message: 'Scene saved successfully', type: 'success' });
                    setTimeout(() => setNotification(null), 3000);
                  } else {
                    setNotification({ message: 'Please enter a scene name', type: 'error' });
                    setTimeout(() => setNotification(null), 3000);
                  }
                }}
              >
                Save
              </button>
              <button 
                className="flex-1 bg-mid-gray/50 text-primary hover:bg-mid-gray/70 py-2 rounded transition-all duration-200 transform hover:scale-95"
                onClick={() => {
                  setShowSaveDialog(false);
                  setSceneName('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 加载对话框 */}
      {showLoadDialog && (
        <div className="fixed inset-0 bg-dark/50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
          <div className="bg-secondary/90 backdrop-blur-sm p-6 rounded-lg w-80 max-h-[80vh] overflow-y-auto transform transition-transform duration-300 ease-in-out scale-100 opacity-100 border border-mid-gray/30 shadow-xl">
            <h3 className="text-lg font-medium mb-4 text-primary">Load Scene</h3>
            {scenes.length === 0 ? (
              <div className="text-mid-gray text-sm mb-4">No saved scenes</div>
            ) : (
              <div className="space-y-2 mb-4">
                {scenes.map((scene) => (
                  <div key={scene.id} className="flex items-center justify-between p-2 bg-light-gray rounded transition-all duration-200 hover:bg-mid-gray/30 border border-mid-gray/30">
                    <div>
                      <div className="text-sm font-medium text-primary">{scene.name}</div>
                      <div className="text-xs text-mid-gray">
                        {new Date(scene.updatedAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="space-x-2">
                      <button 
                        className="text-accent-blue hover:text-accent-blue/80 transition-colors duration-200"
                        onClick={() => {
                          loadScene(scene.id);
                          setShowLoadDialog(false);
                          setNotification({ message: 'Scene loaded successfully', type: 'success' });
                          setTimeout(() => setNotification(null), 3000);
                        }}
                      >
                        Load
                      </button>
                      <button 
                        className="text-accent-orange hover:text-accent-orange/80 transition-colors duration-200"
                        onClick={() => {
                          deleteScene(scene.id);
                          setNotification({ message: 'Scene deleted successfully', type: 'success' });
                          setTimeout(() => setNotification(null), 3000);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button 
              className="w-full bg-mid-gray/50 text-primary hover:bg-mid-gray/70 py-2 rounded transition-all duration-200 transform hover:scale-95"
              onClick={() => setShowLoadDialog(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {/* 通知组件 */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default BlockCraft;