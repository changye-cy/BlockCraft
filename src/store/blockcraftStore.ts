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
        const newBlock: Block = {
          id: Date.now().toString(),
          type,
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          color: get().color,
          material: 'standard',
        };
        set((state) => ({
          blocks: [...state.blocks, newBlock],
          selectedBlock: newBlock.id,
        }));
      },
      
      deleteBlock: (id) => {
        set((state) => ({
          blocks: state.blocks.filter((block) => block.id !== id),
          selectedBlock: state.selectedBlock === id ? null : state.selectedBlock,
        }));
      },
      
      updateBlock: (id, updates) => {
        set((state) => ({
          blocks: state.blocks.map((block) =>
            block.id === id ? { ...block, ...updates } : block
          ),
        }));
      },
      
      selectBlock: (id) => {
        set({ selectedBlock: id });
      },
      
      setActiveTool: (tool) => {
        set({ activeTool: tool });
      },
      
      setColor: (color) => {
        set({ color });
      },
      
      // 摄像头操作
      setIsCameraActive: (active) => {
        set({ isCameraActive: active });
      },
      
      setHandLandmarks: (landmarks) => {
        set({ handLandmarks: landmarks });
      },
      
      setError: (error) => {
        set({ error });
      },
      
      // 场景操作
      saveScene: (name) => {
        const { blocks } = get();
        const newScene: Scene = {
          id: Date.now().toString(),
          name,
          blocks: JSON.parse(JSON.stringify(blocks)),
          cameraPosition: { x: 5, y: 5, z: 5 },
          cameraRotation: { x: 0, y: 0, z: 0 },
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        
        set((state) => ({
          scenes: [...state.scenes, newScene],
          currentScene: newScene,
        }));
      },
      
      loadScene: (sceneId) => {
        const scene = get().scenes.find((s) => s.id === sceneId);
        if (scene) {
          set({
            blocks: JSON.parse(JSON.stringify(scene.blocks)),
            currentScene: scene,
          });
        }
      },
      
      deleteScene: (sceneId) => {
        set((state) => ({
          scenes: state.scenes.filter((s) => s.id !== sceneId),
          currentScene: state.currentScene?.id === sceneId ? null : state.currentScene,
        }));
      },
    }),
    {
      name: 'blockcraft-storage',
    }
  )
);