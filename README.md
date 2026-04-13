# BlockCraft

BlockCraft是一个通过视频识别手势来搭建3D积木的网页应用，提供类似Blender的操作界面。

## 功能特点

- **3D搭建界面**：提供类似Blender的专业3D操作界面
- **手势识别**：通过摄像头实时识别手势，控制积木的放置和操作
- **多种积木类型**：支持立方体、球体、圆柱体等多种积木类型
- **实时预览**：摄像头画面实时显示，方便用户调整手势
- **属性编辑**：可调整积木的位置、旋转、缩放和颜色
- **响应式设计**：适配不同屏幕尺寸

## 技术栈

- **前端**：React 18 + TypeScript + Tailwind CSS
- **3D渲染**：Three.js + @react-three/fiber + @react-three/drei
- **手势识别**：MediaPipe Hands API
- **状态管理**：Zustand
- **构建工具**：Vite

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm run dev
```

### 构建生产版本

```bash
pnpm run build
```

## 使用指南

1. **打开应用**：访问应用后，系统会请求摄像头权限
2. **选择工具**：在左侧工具栏选择需要的积木类型（立方体、球体、圆柱体）
3. **放置积木**：点击工具按钮后，积木会被放置在场景中心
4. **编辑属性**：在右侧属性面板调整积木的位置、旋转、缩放和颜色
5. **手势控制**：摄像头会实时识别手势，未来版本将支持手势控制积木操作
6. **删除积木**：在属性面板点击"Delete Block"按钮删除选中的积木

## 项目结构

```
├── src/
│   ├── components/        # 组件
│   ├── hooks/             # 自定义钩子
│   ├── lib/               # 工具库
│   ├── pages/             # 页面
│   │   └── BlockCraft.tsx # 主页面
│   ├── App.tsx            # 应用入口
│   └── main.tsx           # 主渲染文件
├── .trae/documents/       # 项目文档
│   ├── PRD.md             # 产品需求文档
│   └── TechnicalArchitecture.md # 技术架构文档
├── package.json           # 项目配置
└── README.md              # 项目说明
```

## 未来计划

- [ ] 实现完整的手势控制功能
- [ ] 添加更多积木类型和材质
- [ ] 支持保存和加载作品
- [ ] 添加 undo/redo 功能
- [ ] 实现更高级的3D操作，如复制、粘贴、群组等
- [ ] 优化性能，减少渲染卡顿

## 注意事项

- 首次使用需要授予摄像头权限
- 手势识别功能需要良好的光线条件
- 建议使用现代浏览器，如Chrome、Firefox、Edge等

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

MIT License