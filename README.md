<div align="center">

# MySQL2PG Web

**高性能 MySQL → PostgreSQL 迁移工具 · 产品官网**

[![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Go](https://img.shields.io/badge/Go-1.26+-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://go.dev/)
[![License](https://img.shields.io/badge/License-Apache--2.0-blue?style=for-the-badge)](LICENSE)

[English](#mysql2pg-web) | [中文](README_CN.md)

</div>

---

## 📋 项目简介

MySQL2PG Web 是 [MySQL2PG](https://github.com/xfg0218/MySQL2PG) 高性能数据库迁移工具的产品官网。

网站采用 **Vue 3 + Vite** 构建前端，**Golang** 提供后端服务，设计风格参考 [pduzc.com](https://pduzc.com/)，使用深色主题 + 琥珀金网格动画，突出 DTS 工具对比与核心功能展示。

### 网站内容板块

| 板块 | 说明 |
|------|------|
| Hero | 粒子网格动画背景 + 产品定位 + 核心数据统计 |
| 行业痛点 | 8 张卡片展示传统 DTS 工具的功能短板 |
| 差异化对比 | 13 个维度的 ✅/❌ 对比表（传统 DTS vs MySQL2PG） |
| 核心功能 | 8 大功能卡片（表结构/数据/视图/索引/函数/权限/校验/MPP） |
| 性能指标 | 4 个数字计数器动画（同步速度/准确率/测试用例/并发加速） |
| 转换流程 | 8 步流水线可视化 |
| 版本兼容 | MySQL 5.7~9.0+ / PostgreSQL 12~18 |
| 快速开始 | 3 步配置 + 命令示例 |

---

## 🏗 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端框架 | Vue 3 | Composition API + `<script setup>` |
| 构建工具 | Vite 8 | 极速 HMR 开发体验 |
| 后端服务 | Go 1.26 | 静态文件服务 + SPA 路由 |
| 样式方案 | 原生 CSS | CSS 变量 + 网格动画 |
| 字体 | Inter + JetBrains Mono | Google Fonts |

---

## 📁 项目结构

```
MySQL2PGWeb/
├── frontend/                    # Vue3 + Vite 前端
│   ├── src/
│   │   ├── assets/
│   │   │   └── style.css        # 全局样式（琥珀金 + 网格动画）
│   │   ├── components/
│   │   │   ├── NavBar.vue       # 顶部导航栏
│   │   │   ├── HeroSection.vue  # Hero 区域（网格动画背景）
│   │   │   ├── PainPoints.vue   # 行业痛点卡片
│   │   │   ├── Comparison.vue   # DTS 差异化对比表
│   │   │   ├── Features.vue     # 核心功能卡片
│   │   │   ├── Metrics.vue      # 性能指标（计数动画）
│   │   │   ├── FlowSteps.vue    # 转换流程步骤
│   │   │   ├── Versions.vue     # 版本兼容性
│   │   │   ├── QuickStart.vue   # 快速开始指南
│   │   │   └── FooterBar.vue    # 页脚
│   │   ├── App.vue              # 主应用组件
│   │   └── main.js              # 入口文件
│   ├── dist/                    # 构建产物（npm run build 生成）
│   ├── index.html               # HTML 模板
│   ├── package.json
│   └── vite.config.js           # Vite 配置
├── server/                      # Golang 后端
│   ├── main.go                  # HTTP 服务器 + SPA fallback
│   └── go.mod
├── Makefile                     # 构建命令
├── mysql2pg-web                 # Go 二进制（make build 生成）
├── LICENSE
└── README.md
```

---

## 🚀 快速开始

### 环境要求

- **Node.js** 18+
- **Go** 1.24+

### 开发模式

```bash
# 安装前端依赖（首次）
cd frontend && npm install

# 启动 Vite 开发服务器（支持 HMR 热更新）
make dev
# 或
cd frontend && npm run dev
```

访问 `http://localhost:5173` 查看开发预览。

### 生产构建

```bash
# 构建前端 + 编译 Go 服务器
make build
```

产物说明：
- `frontend/dist/` — Vite 构建的静态文件
- `mysql2pg-web` — Go 二进制文件

### 启动生产服务

```bash
# 构建并启动（默认端口 80）
make serve

# 或手动启动并指定端口
PORT=8080 ./mysql2pg-web
```

访问 `http://localhost`（或自定义端口）查看网站。

### 清理

```bash
make clean    # 删除 dist/、node_modules/、二进制文件
```

---

## 🎨 设计规范

| 属性 | 值 |
|------|-----|
| 背景色 | `#09090b` |
| 卡片背景 | `#18181b` / `#1c1c20` |
| 强调色（琥珀金） | `#f59e0b` / `#fbbf24` |
| 成功色 | `#22c55e` |
| 错误色 | `#ef4444` |
| 正文字体 | Inter 400/600/700/800 |
| 等宽字体 | JetBrains Mono 400/700 |
| 网格动画 | 40px 网格线，20s 漂移循环 |
| 圆角 | 12px（卡片）/ 8px（按钮/代码块） |

---

## 📝 组件说明

### NavBar
固定顶部导航，毛玻璃背景。包含 Logo、板块锚点链接、GitHub 按钮和 Quick Start CTA。

### HeroSection
全屏 Hero 区域。40px 网格线漂移动画背景，渐变文字标题，版本号徽章，4 项核心数据统计。

### PainPoints
8 张痛点卡片，红色图标 + hover 红色边框，展示传统 DTS 工具的 8 大功能短板。

### Comparison
13 行对比表格。左列传统 DTS（红色 ❌），右列 MySQL2PG（绿色 ✅），一目了然。

### Features
8 张功能卡片，金色图标 + hover 发光效果，每张卡片底部有金色指标标签。

### Metrics
4 个性能指标盒子，IntersectionObserver 触发数字计数动画，顶部金色渐变线装饰。

### FlowSteps
8 步转换流程列表，金色序号圆圈 + hover 金色边框。

### Versions
MySQL 和 PostgreSQL 版本兼容矩阵，金色标签展示支持的版本号。

### QuickStart
3 步快速开始卡片，包含语法高亮的 YAML 配置和 Shell 命令。

### FooterBar
简洁页脚，GitHub 链接 + License + 版权信息。

---

## 📄 License

[Apache-2.0](LICENSE)

---

<p align="center">
  Made with ❤️ for the <a href="https://github.com/xfg0218/MySQL2PG">MySQL2PG</a> project
</p>
