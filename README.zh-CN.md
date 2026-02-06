# CCSeva 🤖

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub release](https://img.shields.io/github/release/Iamshankhadeep/ccseva.svg)](https://github.com/Iamshankhadeep/ccseva/releases)
[![Build Status](https://img.shields.io/github/actions/workflow/status/Iamshankhadeep/ccseva/ci.yml?branch=main)](https://github.com/Iamshankhadeep/ccseva/actions)
[![Downloads](https://img.shields.io/github/downloads/Iamshankhadeep/ccseva/total.svg)](https://github.com/Iamshankhadeep/ccseva/releases)
[![macOS](https://img.shields.io/badge/macOS-10.15%2B-blue)](https://github.com/Iamshankhadeep/ccseva)

一款精美的 macOS 菜单栏应用，用于实时追踪你的 Claude Code 使用情况。通过优雅的界面监控令牌消耗、成本和使用模式。

## 截图

![仪表板](./screenshots/dashboard.png)
![分析](./screenshots/analytics.png)
![终端](./screenshots/terminal.png)

## 功能特性

- **实时监控** - 30秒更新周期的实时令牌使用追踪
- **菜单栏集成** - 百分比指示器，带颜色编码状态
- **智能套餐检测** - 自动检测 Pro/Max5/Max20/Custom 套餐
- **使用分析** - 7天图表、模型分类和趋势分析
- **智能通知** - 在 70% 和 90% 阈值时发出警报（带冷却机制）
- **成本追踪** - 每日成本估算和消耗速率计算
- **多语言支持** - 完整国际化支持，提供英文和中文界面
- **精美界面** - 渐变设计配合玻璃态效果

## 安装

### 下载（推荐）
从 [GitHub Releases](https://github.com/Iamshankhadeep/ccseva/releases) 下载最新版本：
- **macOS (Apple Silicon)**: `CCSeva-darwin-arm64.dmg`
- **macOS (Intel)**: `CCSeva-darwin-x64.dmg`

### 从源码构建
```bash
git clone https://github.com/Iamshankhadeep/ccseva.git
cd ccseva
npm install
npm run build
npm start
```

### 开发模式
```bash
npm run electron-dev  # 热重载开发模式
```

## 使用方法

1. **启动** - CCSeva 会出现在菜单栏中
2. **点击** - 查看详细的使用统计
3. **右键点击** - 访问刷新和退出选项
4. **设置** - 配置语言偏好（English/中文）、时区和套餐设置

应用会自动从 `~/.claude` 目录检测你的 Claude Code 配置，每 30 秒更新一次。

### 语言设置

在设置 → 语言中切换英文和中文界面。界面即时适配，无需重启应用。

## 系统要求

- macOS 10.15+
- Node.js 18+（仅从源码构建时需要）
- 已安装并配置 Claude Code CLI

## 技术栈

- Electron 36 + React 19 + TypeScript 5
- Tailwind CSS 3 + Radix UI 组件
- ccusage 包用于数据集成
- i18next 用于国际化

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件。

## 致谢

使用 ❤️ 构建，基于 [Electron](https://electronjs.org)、[React](https://reactjs.org)、[Tailwind CSS](https://tailwindcss.com) 和 [ccusage](https://github.com/ryoppippi/ccusage)。

---

**注意**：这是一个用于追踪 Claude Code 使用情况的非官方工具。需要有效的 Claude Code 安装和配置。

## 文档

- [English](README.md)
- [简体中文](README.zh-CN.md)
