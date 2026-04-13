# BlockCraft

BlockCraft是一个基于React 18 + TypeScript的3D交互应用，使用Three.js进行3D渲染，集成了MediaPipe Hands API用于手势识别，并应用了Anthropic品牌指南进行界面设计。

## 功能特性

- 🎨 算法艺术背景，支持鼠标交互
- 🏗️ 3D场景渲染，支持旋转和缩放
- ✋ 手势识别功能，支持通过手势控制3D场景
- 🎯 响应式设计，适配不同设备
- 📱 现代前端界面，应用Anthropic品牌指南

## 技术栈

- **前端框架**：React 18 + TypeScript
- **3D渲染**：Three.js + @react-three/fiber + @react-three/drei
- **手势识别**：MediaPipe Hands API + TensorFlow.js
- **状态管理**：Zustand
- **样式**：Tailwind CSS
- **构建工具**：Vite

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

开发服务器将在 `http://localhost:5173` 启动。

### 构建生产版本

```bash
npm run build
```

构建产物将生成在 `dist` 目录中。

### 预览生产构建

```bash
npm run preview
```

预览服务器将在 `http://localhost:4173` 启动（端口可能会根据可用性调整）。

### 运行代码检查

```bash
# 运行ESLint
npm run lint

# 运行TypeScript类型检查
npm run check
```

## 项目结构

```
/src
  /components
    - AlgorithmicBackground.tsx  # 算法艺术背景组件
    - Scene3D.tsx              # 3D场景组件
    - GestureRecognition.tsx   # 手势识别组件
  /pages
    - BlockCraft.tsx           # 主页面
  /store
    - blockcraftStore.ts       # 状态管理
  - index.css                  # 全局样式（包含Anthropic品牌指南）
  - main.tsx                   # 应用入口
```

## 注意事项

- 手势识别功能需要摄像头权限
- 3D渲染可能在低配置设备上性能受限
- 确保浏览器支持WebGL和MediaPipe Hands API

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

MIT
