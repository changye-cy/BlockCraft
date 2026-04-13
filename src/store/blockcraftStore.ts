import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 积木类型定义
export interface Block {
  id: string;
  type: 'cube' | 'sphere' | 'cylinder';
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  color: string;
  material: string;
}

// 场景类型定义
export interface Scene {
  id: string;
  name: string;
  blocks: Block[];
  cameraPosition: { x: number; y: number; z: number };
  cameraRotation: { x: number; y: number; z: number };
  createdAt: number;
  updatedAt: number;
}

// 状态类型定义
interface BlockCraftState {
  // 积木相关
  blocks: Block[];
  selectedBlock: string | null;
  activeTool: 'select' | 'cube' | 'sphere' | 'cylinder';
  color: string;
  
  // 摄像头相关
  isCameraActive: boolean;
  handLandmarks: any[];
  error: string | null;
  
  // 场景相关
  scenes: Scene[];
  currentScene: Scene | null;
  
  // 积木操作
  addBlock: (type: 'cube' | 'sphere' | 'cylinder') => void;
  deleteBlock: (id: string) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  selectBlock: (id: string | null) => void;
  setActiveTool: (tool: 'select' | 'cube' | 'sphere' | 'cylinder') => void;
  setColor: (color: string) => void;
  
  // 摄像头操作
  setIsCameraActive: (active: boolean) => void;
  setHandLandmarks: (landmarks: any[]) => void;
  setError: (error: string | null) => void;
  
  // 场景操作
  saveScene: (name: string) => void;
  loadScene: (sceneId: string) => void;
  deleteScene: (sceneId: string) => void;
}

// 生成唯一ID的辅助函数
const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// 深度克隆对象的辅助函数
const deepClone = <T>(obj: T): T => {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    console.error('Error cloning object:', error);
    return obj;
  }
};

// 验证积木数据的辅助函数
const validateBlock = (block: Block): boolean => {
  return (
    block.id &&
    ['cube', 'sphere', 'cylinder'].includes(block.type) &&
    typeof block.position === 'object' &&
    typeof block.rotation === 'object' &&
    typeof block.scale === 'object' &&
    typeof block.color === 'string' &&
    typeof block.material === 'string'
  );
};

// 验证场景数据的辅助函数
const validateScene = (scene: Scene): boolean => {
  return (
    scene.id &&
    typeof scene.name === 'string' &&
    Array.isArray(scene.blocks) &&
    typeof scene.cameraPosition === 'object' &&
    typeof scene.cameraRotation === 'object' &&
    typeof scene.createdAt === 'number' &&
    typeof scene.updatedAt === 'number'
  );
};

// 创建Zustand store
export const useBlockCraftStore = create<BlockCraftState>()(
  persist(
    (set, get) => ({
      // 初始状态
      blocks: [],
      selectedBlock: null,
      activeTool: 'select',
      color: '#3b82f6',
      isCameraActive: false,
      handLandmarks: [],
      error: null,
      scenes: [],
      currentScene: null,
      
      // 积木操作
      addBlock: (type) => {
        try {
          const newBlock: Block = {
            id: generateId(),
            type,
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            color: get().color,
            material: 'standard',
          };
          
          if (validateBlock(newBlock)) {
            set((state) => ({
              blocks: [...state.blocks, newBlock],
              selectedBlock: newBlock.id,
              error: null,
            }));
          } else {
            throw new Error('Invalid block data');
          }
        } catch (error) {
          console.error('Error adding block:', error);
          set({ error: 'Failed to add block' });
        }
      },
      
      deleteBlock: (id) => {
        try {
          set((state) => ({
            blocks: state.blocks.filter((block) => block.id !== id),
            selectedBlock: state.selectedBlock === id ? null : state.selectedBlock,
            error: null,
          }));
        } catch (error) {
          console.error('Error deleting block:', error);
          set({ error: 'Failed to delete block' });
        }
      },
      
      updateBlock: (id, updates) => {
        try {
          set((state) => {
            const updatedBlocks = state.blocks.map((block) => {
              if (block.id === id) {
                const updatedBlock = { ...block, ...updates };
                if (validateBlock(updatedBlock)) {
                  return updatedBlock;
                } else {
                  throw new Error('Invalid block updates');
                }
              }
              return block;
            });
            return {
              blocks: updatedBlocks,
              error: null,
            };
          });
        } catch (error) {
          console.error('Error updating block:', error);
          set({ error: 'Failed to update block' });
        }
      },
      
      selectBlock: (id) => {
        try {
          set({ 
            selectedBlock: id,
            error: null,
          });
        } catch (error) {
          console.error('Error selecting block:', error);
          set({ error: 'Failed to select block' });
        }
      },
      
      setActiveTool: (tool) => {
        try {
          if (['select', 'cube', 'sphere', 'cylinder'].includes(tool)) {
            set({ 
              activeTool: tool,
              error: null,
            });
          } else {
            throw new Error('Invalid tool type');
          }
        } catch (error) {
          console.error('Error setting active tool:', error);
          set({ error: 'Failed to set active tool' });
        }
      },
      
      setColor: (color) => {
        try {
          if (typeof color === 'string' && color.startsWith('#')) {
            set({ 
              color,
              error: null,
            });
          } else {
            throw new Error('Invalid color format');
          }
        } catch (error) {
          console.error('Error setting color:', error);
          set({ error: 'Failed to set color' });
        }
      },
      
      // 摄像头操作
      setIsCameraActive: (active) => {
        try {
          set({ 
            isCameraActive: active,
            error: null,
          });
        } catch (error) {
          console.error('Error setting camera active state:', error);
          set({ error: 'Failed to set camera state' });
        }
      },
      
      setHandLandmarks: (landmarks) => {
        try {
          if (Array.isArray(landmarks)) {
            set({ 
              handLandmarks: landmarks,
              error: null,
            });
          } else {
            throw new Error('Landmarks must be an array');
          }
        } catch (error) {
          console.error('Error setting hand landmarks:', error);
          set({ error: 'Failed to set hand landmarks' });
        }
      },
      
      setError: (error) => {
        try {
          set({ error });
        } catch (err) {
          console.error('Error setting error:', err);
        }
      },
      
      // 场景操作
      saveScene: (name) => {
        try {
          if (typeof name !== 'string' || name.trim() === '') {
            throw new Error('Scene name is required');
          }
          
          const { blocks } = get();
          const newScene: Scene = {
            id: generateId(),
            name: name.trim(),
            blocks: deepClone(blocks),
            cameraPosition: { x: 5, y: 5, z: 5 },
            cameraRotation: { x: 0, y: 0, z: 0 },
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          
          if (validateScene(newScene)) {
            set((state) => ({
              scenes: [...state.scenes, newScene],
              currentScene: newScene,
              error: null,
            }));
          } else {
            throw new Error('Invalid scene data');
          }
        } catch (error) {
          console.error('Error saving scene:', error);
          set({ error: 'Failed to save scene' });
        }
      },
      
      loadScene: (sceneId) => {
        try {
          const scene = get().scenes.find((s) => s.id === sceneId);
          if (scene && validateScene(scene)) {
            set({
              blocks: deepClone(scene.blocks),
              currentScene: scene,
              error: null,
            });
          } else {
            throw new Error('Scene not found or invalid');
          }
        } catch (error) {
          console.error('Error loading scene:', error);
          set({ error: 'Failed to load scene' });
        }
      },
      
      deleteScene: (sceneId) => {
        try {
          set((state) => ({
            scenes: state.scenes.filter((s) => s.id !== sceneId),
            currentScene: state.currentScene?.id === sceneId ? null : state.currentScene,
            error: null,
          }));
        } catch (error) {
          console.error('Error deleting scene:', error);
          set({ error: 'Failed to delete scene' });
        }
      },
    }),
    {
      name: 'blockcraft-storage',
      // 优化持久化配置
      partialize: (state) => ({
        blocks: state.blocks,
        scenes: state.scenes,
        currentScene: state.currentScene,
        color: state.color,
      }),
      // 错误处理
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error('Error rehydrating state:', error);
          }
        };
      },
    }
  )
);