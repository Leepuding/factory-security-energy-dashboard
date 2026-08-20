# 智慧工厂平台统一入口 QA

## 结果

- 本地预览：通过
- 服务器部署：通过
- 公网访问：通过
- 最终入口：http://1.13.195.57/
- 报价 Demo：http://1.13.195.57/quotation/
- AI 产品介绍平台：http://1.13.195.57/smart-selector/

## 设计对照

- 概念图：`/Users/leepudding/.codex/generated_images/019f7dff-92c0-7813-b18d-21601909ed9c/exec-fc71e299-0fa7-44df-9998-bb4b0784d41a.png`
- 本地渲染截图：`system-portal/qa/portal-render-1440.png`
- 移动端截图：`system-portal/qa/portal-render-mobile.png`

## Fidelity Ledger

1. 品牌文案：概念图原品牌文案已按用户要求替换为“智慧工厂平台”，页面源码与公网 DOM 均未检出旧名称。
2. 信息架构：统一入口包含驾驶舱、AI 文档分析、非标件 AI 自动报价、AI 产品介绍平台四项业务。
3. 布局：1440px 桌面下四张卡片横向等宽排列，中等宽度两列，移动端单列堆叠，无横向溢出。
4. 色彩：沿用白色、冷灰、深蓝、青绿色的制造业视觉方向，没有引入额外营销风格。
5. 交互：四个“进入系统”链接均可点击，公网入口动态生成当前服务器域名下的目标链接。
6. 子路径：报价 Demo 与 AI 产品介绍平台分别在 `/quotation/`、`/smart-selector/` 下独立加载。

## 验证项

- `npm run build`：通过
- 本地 `http://127.0.0.1:4174/`：通过
- 本地 `http://127.0.0.1:4174/quotation/`：通过
- 本地 `http://127.0.0.1:4174/smart-selector/`：通过
- 公网 `http://1.13.195.57/`：200 OK
- 公网 `http://1.13.195.57/quotation/`：200 OK
- 公网 `http://1.13.195.57/smart-selector/`：200 OK
- 公网 `http://1.13.195.57:28080/`：200 OK
- 公网 `http://1.13.195.57:28080/document-analysis.html`：200 OK

## 说明

公网浏览器截图接口曾超时，但公网 DOM 与 HTTP 状态检查均通过；本地浏览器截图已完成视觉对照。
