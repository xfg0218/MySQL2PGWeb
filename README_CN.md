<div align="center">

# MySQL2PG Web

**高性能 MySQL → PostgreSQL 迁移工具 · 产品官网**

[![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Go](https://img.shields.io/badge/Go-1.24+-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://go.dev/)
[![License](https://img.shields.io/badge/License-Apache--2.0-blue?style=for-the-badge)](LICENSE)

[English](README.md) | 中文

</div>

---

## 📋 项目简介

MySQL2PG Web 是 [MySQL2PG](https://github.com/xfg0218/MySQL2PG) 高性能数据库迁移工具的产品官网。

网站采用 **Vue 3 + Vite** 构建前端，**Golang** 提供后端服务，支持 **深色/浅色主题切换** 和 **中文/英文双语展示**。

### ✨ 特色功能

| 功能 | 说明 |
|------|------|
| 🌓 主题切换 | 深色/浅色（Dark/Light）一键切换，CSS 变量驱动，选择持久化到 localStorage |
| 🌐 双语支持 | 中文/英文完整翻译，所有板块内容实时切换，偏好保存到 localStorage |
| 🎞 滚动动画 | IntersectionObserver 驱动的渐入动画，语言切换时自动重新绑定 |
| 📊 数字计数 | 性能指标区域滚动触发数字递增动画 |
| 📱 响应式布局 | 桌面/平板/手机自适应网格布局 |

### 网站内容板块

| 板块 | 说明 |
|------|------|
| Hero | 网格漂移动画背景 + 产品定位 + 核心数据统计（100+ 类型 / 113 函数 / 42 视图 / 500+ 测试） |
| 行业痛点 | 8 张卡片展示传统 DTS 工具的功能短板 |
| 差异化对比 | 13 个维度的 ✅/❌ 对比表（传统 DTS vs MySQL2PG） |
| 竞品横向对比 | 4 列对比表（MySQL2PG vs pgloader vs AWS DMS vs Azure DMS），10 个功能维度 |
| 核心功能 | 8 大功能卡片（表结构/数据/视图/索引/函数/权限/校验/MPP） |
| 架构原理图 | 5 步流水线可视化：MySQL 源库 → SQL 解析器 → 类型映射引擎 → 兼容性校验 → PG 生成器 |
| SQL 转换示例 | 6 组 Before/After 代码对比（表结构/索引/函数/视图/用户/权限），带标签切换 + 语法高亮 |
| 迁移报告预览 | 模拟浏览器窗口展示报告内容（统计摘要 + 风险告警 + 校验结果） |
| 迁移前评估 | 4 张风险类别卡片（表结构/函数/数据量/权限），绿色/琥珀色严重度指示 |
| 安全与数据保障 | 6 张安全保障卡片（凭证安全/传输加密/纯本地运行/源库零修改/开源透明/可回滚设计）+ 底部总结横幅 |
| 性能指标 | 4 个数字计数器动画（同步速度/准确率/测试用例/并发加速） |
| 转换流程 | 8 步卡片式流水线展示 + 汇总统计 |
| 版本兼容 | MySQL 5.7~9.0+ / PostgreSQL 12~18 |
| 快速开始 | 3 步配置 + 语法高亮命令示例 |
| FAQ | 10 个常见问题手风琴折叠面板，点击展开/收起 |

---

## 🏗 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端框架 | Vue 3 | Composition API + `<script setup>` |
| 构建工具 | Vite 8 | 极速 HMR 开发体验 |
| 后端服务 | Go 1.24+ | 静态文件服务 + SPA fallback 路由 |
| 样式方案 | 原生 CSS | CSS 自定义属性 + 主题变量 + 网格动画 |
| 状态管理 | Vue Composables | `useTheme` / `useLang`，无第三方依赖 |
| 字体 | Inter + JetBrains Mono | Google Fonts |

---

## 📁 项目结构

```
MySQL2PGWeb/
├── frontend/                      # Vue 3 + Vite 前端
│   ├── src/
│   │   ├── assets/
│   │   │   └── style.css          # 全局样式（深色/浅色主题 + 网格动画）
│   │   ├── components/
│   │   │   ├── NavBar.vue         # 顶部导航栏（主题/语言切换按钮）
│   │   │   ├── HeroSection.vue    # Hero 区域（网格动画背景）
│   │   │   ├── PainPoints.vue     # 行业痛点卡片
│   │   │   ├── Comparison.vue     # DTS 差异化对比表
│   │   │   ├── Competitors.vue    # 竞品横向对比表（4 列）
│   │   │   ├── Features.vue       # 核心功能卡片
│   │   │   ├── Architecture.vue   # 架构原理图（5 步流水线）
│   │   │   ├── SqlDemo.vue        # SQL 转换前后对比（标签切换）
│   │   │   ├── ReportPreview.vue  # 迁移报告预览（模拟浏览器窗口）
│   │   │   ├── Assessment.vue     # 迁移前风险评估卡片
│   │   │   ├── Security.vue       # 安全与数据保障卡片
│   │   │   ├── Metrics.vue        # 性能指标（计数动画）
│   │   │   ├── FlowSteps.vue      # 8 步转换流程卡片
│   │   │   ├── Versions.vue       # 版本兼容性
│   │   │   ├── QuickStart.vue     # 快速开始指南
│   │   │   ├── FAQ.vue            # 常见问题手风琴
│   │   │   └── FooterBar.vue      # 页脚
│   │   ├── composables/
│   │   │   ├── useTheme.js        # 主题切换 composable（dark/light + localStorage）
│   │   │   └── useLang.js         # 国际化 composable（zh/en + 完整翻译字典）
│   │   ├── App.vue                # 主应用（初始化主题/语言 + 滚动动画）
│   │   └── main.js                # 入口文件
│   ├── dist/                      # 构建产物（npm run build 生成）
│   ├── index.html                 # HTML 模板
│   ├── package.json
│   └── vite.config.js             # Vite 配置
├── server/                        # Golang 后端
│   ├── main.go                    # HTTP 服务器 + SPA fallback
│   └── go.mod
├── start.sh                       # 一键启动脚本（环境检查→安装→构建→运行）
├── Makefile                       # 构建命令
├── mysql2pg-web                   # Go 二进制（make build 生成）
├── LICENSE
└── README.md
```

---

## 🚀 快速开始

### 环境要求

- **Node.js** 18+
- **Go** 1.24+

### 一键启动（推荐）

```bash
bash start.sh
```

脚本自动完成：检查环境 → 安装依赖 → 构建前端 → 编译 Go → 启动服务（默认端口 80）。

可通过环境变量指定端口：

```bash
PORT=8080 bash start.sh
```

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

### 深色主题（默认）

| 属性 | 值 |
|------|-----|
| 背景色 | `#09090b` |
| 卡片背景 | `#18181b` / `#1c1c20` |
| 强调色（琥珀金） | `#f59e0b` / `#fbbf24` |
| 成功色 | `#22c55e` |
| 错误色 | `#ef4444` |
| 导航栏背景 | `rgba(9, 9, 11, 0.8)` + 毛玻璃 |

### 浅色主题

| 属性 | 值 |
|------|-----|
| 背景色 | `#ffffff` |
| 卡片背景 | `#ffffff`（section-alt: `#f4f4f5`） |
| 强调色（琥珀金） | `#f59e0b` / `#fbbf24`（保持不变） |
| 边框色 | `#e4e4e7` |
| 导航栏背景 | `rgba(255, 255, 255, 0.85)` + 毛玻璃 |

### 通用

| 属性 | 值 |
|------|-----|
| 正文字体 | Inter 400/600/700/800 |
| 等宽字体 | JetBrains Mono 400/700 |
| 网格动画 | 40px 网格线，20s 漂移循环 |
| 圆角 | 12px（卡片）/ 8px（按钮/代码块） |

---

## 🧩 架构说明

### 主题切换（useTheme）

- 通过 `document.documentElement.classList.toggle('light')` 切换 `html.light` 类
- CSS 变量在 `:root` 定义深色值，`html.light` 覆盖为浅色值
- 偏好保存到 `localStorage`，刷新后保持选择
- 导航栏 ☀️/🌙 按钮一键切换

### 国际化（useLang）

- 基于 Vue Composition API 的轻量方案，无第三方 i18n 库
- `useLang()` 返回响应式的 `t`（当前语言翻译对象）和 `lang`（当前语言标识）
- 所有组件通过 `t.xxx` 引用翻译内容，语言切换时自动响应式更新
- 翻译数据定义在 `composables/useLang.js`，包含完整的中英文对照
- 导航栏 EN/中 按钮一键切换

### 滚动动画

- `App.vue` 中通过 `IntersectionObserver` 监听 `.reveal` 元素
- 进入视口时添加 `.visible` 类触发 CSS 过渡动画（渐入 + 上移）
- 语言切换后通过 `watch(lang)` + `nextTick` 重新绑定未触发的元素

---

## 📝 组件说明

| 组件 | 说明 |
|------|------|
| **NavBar** | 固定顶部导航，毛玻璃背景。Logo、锚点链接、EN/中切换、☀️/🌙切换、GitHub 按钮、Quick Start CTA |
| **HeroSection** | 全屏 Hero。40px 网格漂移动画背景，渐变文字标题，4 项核心数据统计 |
| **PainPoints** | 8 张痛点卡片，红色图标 + hover 红色边框，展示传统 DTS 工具的 8 大功能短板 |
| **Comparison** | 13 行对比表格。左列传统 DTS（红色 ❌），右列 MySQL2PG（绿色 ✅） |
| **Competitors** | 4 列竞品对比表。MySQL2PG vs pgloader vs AWS DMS vs Azure DMS，10 个功能维度 ✓/— 标识 |
| **Features** | 8 张功能卡片，金色图标 + hover 发光效果，底部金色指标标签 |
| **Architecture** | 5 步流水线可视化，箭头脉冲动画连接各阶段，响应式横/纵布局切换 |
| **SqlDemo** | 6 组 SQL 转换对比，标签切换（表结构/索引/函数/视图/用户/权限），左右并排 MySQL → PostgreSQL 代码高亮 |
| **ReportPreview** | 左侧 4 张报告内容卡片 + 右侧模拟浏览器窗口（统计摘要 + 风险告警列表） |
| **Assessment** | 4 张风险评估卡片（绿色/琥珀色顶部色条 + 分数），底部评估命令展示 |
| **Security** | 6 张安全保障卡片（凭证安全/传输加密/纯本地运行/源库零修改/开源透明/可回滚设计），hover 琥珀色发光 + 底部总结横幅 |
| **Metrics** | 4 个性能指标，IntersectionObserver 触发数字计数动画，语言切换时重置并重新播放 |
| **FlowSteps** | 8 步转换流程卡片网格 + 3 项汇总统计 |
| **Versions** | MySQL / PostgreSQL 版本兼容矩阵标签 |
| **QuickStart** | 3 步快速开始卡片，语法高亮 YAML 配置和 Shell 命令 |
| **FAQ** | 10 个常见问题手风琴，点击展开/收起，CSS max-height 过渡动画 |
| **FooterBar** | 简洁页脚，GitHub 链接 + License + 版权信息 |

---

## 📄 License

[Apache-2.0](LICENSE)

---

<p align="center">
  Made with ❤️ for the <a href="https://github.com/xfg0218/MySQL2PG">MySQL2PG</a> project
</p>
