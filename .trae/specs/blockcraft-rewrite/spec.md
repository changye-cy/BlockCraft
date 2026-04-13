# BlockCraft - Product Requirement Document

## Overview
- **Summary**: BlockCraft是一个通过视频识别手势来搭建3D积木的网页应用，提供类似Blender的操作界面，让用户通过摄像头手势控制来创建和编辑3D积木模型。
- **Purpose**: 提供直观的3D创作体验，无需传统鼠标键盘操作，面向创意爱好者、教育领域和休闲用户。
- **Target Users**: 创意爱好者、教育工作者、学生和休闲用户。

## Goals
- 实现通过摄像头手势识别来控制3D积木的搭建
- 提供类似Blender的专业3D操作界面
- 支持多种积木类型和属性调整
- 实现作品的本地存储功能
- 提供流畅的3D渲染和交互体验

## Non-Goals (Out of Scope)
- 后端服务器和用户认证
- 在线保存和分享功能
- 复杂的材质和光照系统
- 多人协作功能
- 高级3D建模工具

## Background & Context
- 项目基于React 18 + TypeScript + Tailwind CSS + Vite技术栈
- 使用Three.js + @react-three/fiber + @react-three/drei进行3D渲染
- 使用MediaPipe Hands API进行手势识别
- 使用Zustand进行状态管理
- 所有数据存储在本地localStorage中

## Functional Requirements
- **FR-1**: 3D搭建界面 - 主工作区、工具栏、属性面板、视频捕捉区域
- **FR-2**: 手势识别 - 通过摄像头识别用户手势并转换为3D操作
- **FR-3**: 积木操作 - 放置、移动、旋转、缩放积木
- **FR-4**: 积木类型 - 支持立方体、球体、圆柱体等多种积木类型
- **FR-5**: 属性编辑 - 调整积木的颜色、大小、位置、旋转等属性
- **FR-6**: 本地存储 - 保存和加载作品到本地

## Non-Functional Requirements
- **NFR-1**: 性能 - 3D渲染流畅，帧率不低于30FPS
- **NFR-2**: 响应式设计 - 支持桌面和平板设备
- **NFR-3**: 用户体验 - 界面直观易用，手势识别准确
- **NFR-4**: 可访问性 - 支持基本的键盘操作和屏幕阅读器
- **NFR-5**: 安全性 - 合理使用摄像头权限，保护用户隐私

## Constraints
- **Technical**: 依赖浏览器对WebGL和MediaDevices API的支持
- **Business**: 无预算限制，专注于功能实现
- **Dependencies**: Three.js、MediaPipe Hands API、React、TypeScript、Tailwind CSS

## Assumptions
- 用户拥有支持摄像头的设备
- 用户使用现代浏览器（Chrome、Firefox、Edge）
- 用户会授予摄像头访问权限
- 设备性能足够运行3D渲染和手势识别

## Acceptance Criteria

### AC-1: 应用启动和摄像头权限
- **Given**: 用户打开应用
- **When**: 首次访问时
- **Then**: 系统请求摄像头权限，获得权限后进入3D搭建界面
- **Verification**: `human-judgment`

### AC-2: 3D场景渲染
- **Given**: 应用启动后
- **When**: 进入3D搭建界面
- **Then**: 显示3D场景，包含网格辅助线，支持相机控制
- **Verification**: `human-judgment`

### AC-3: 手势识别功能
- **Given**: 摄像头权限已授予
- **When**: 用户在摄像头前做出手势
- **Then**: 系统识别手势并转换为相应的3D操作
- **Verification**: `human-judgment`

### AC-4: 积木操作
- **Given**: 3D场景已加载
- **When**: 用户通过手势或界面操作
- **Then**: 可以放置、移动、旋转、缩放积木
- **Verification**: `human-judgment`

### AC-5: 积木类型选择
- **Given**: 工具栏已显示
- **When**: 用户选择不同的积木类型
- **Then**: 系统切换到相应的积木类型，准备放置
- **Verification**: `human-judgment`

### AC-6: 属性编辑
- **Given**: 积木已选中
- **When**: 用户在属性面板中调整参数
- **Then**: 积木的属性实时更新
- **Verification**: `human-judgment`

### AC-7: 本地存储
- **Given**: 作品已创建
- **When**: 用户保存作品
- **Then**: 作品数据保存到localStorage
- **Verification**: `programmatic`

### AC-8: 响应式设计
- **Given**: 不同尺寸的设备
- **When**: 访问应用
- **Then**: 界面自动调整以适应不同屏幕尺寸
- **Verification**: `human-judgment`

## Open Questions
- [ ] 具体的手势映射方案需要进一步确定
- [ ] 性能优化策略需要根据实际设备情况调整
- [ ] 本地存储的容量限制和管理策略
- [ ] 摄像头权限被拒绝时的 fallback 方案