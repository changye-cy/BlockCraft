## 1. Architecture Design
```mermaid
graph TD
  A[用户浏览器] --> B[前端应用]
  B --> C[3D渲染引擎]
  B --> D[手势识别模块]
  B --> E[本地存储]
  D --> F[摄像头API]
  C --> G[Three.js]
  D --> H[MediaPipe]
```

## 2. Technology Description
- Frontend: React@18 + TypeScript + Tailwind CSS@3 + Vite
- 3D渲染: Three.js + @react-three/fiber + @react-three/drei
- 手势识别: MediaPipe Hands API
- 状态管理: Zustand
- 本地存储: localStorage (用于保存作品)
- 构建工具: Vite

## 3. Route Definitions
| 路由 | 用途 |
|------|------|
| / | 3D搭建界面，应用的唯一页面 |

## 4. API Definitions
无后端API，所有功能均在前端实现。

## 5. Server Architecture Diagram
无后端服务，所有逻辑均在前端执行。

## 6. Data Model
### 6.1 Data Model Definition
```mermaid
erDiagram
  BLOCK { 
    string id 
    string type 
    number x 
    number y 
    number z 
    number rotationX 
    number rotationY 
    number rotationZ 
    string color 
    number scale 
  }
  SCENE { 
    string id 
    string name 
    array blocks 
    object cameraPosition 
    object cameraRotation 
  }
```

### 6.2 Data Definition Language
无数据库，数据存储在本地localStorage中，结构如下：

```javascript
// 场景数据结构
interface Block {
  id: string;
  type: string; // 'cube', 'sphere', 'cylinder'等
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  color: string; // 十六进制颜色值
  material: string; // 'standard', 'phong'等
}

interface Scene {
  id: string;
  name: string;
  blocks: Block[];
  cameraPosition: { x: number; y: number; z: number };
  cameraRotation: { x: number; y: number; z: number };
  createdAt: number;
  updatedAt: number;
}
```