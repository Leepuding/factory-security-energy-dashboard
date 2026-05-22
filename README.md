# 智慧工厂安防与能耗驾驶舱

Vue3 + Vite + ECharts 实现的安防主导型智慧工厂驾驶舱原型，使用本地 mock 数据和本地 SVG/图片资源，可直接构建为静态页面。

## 本地运行

```bash
npm install
npm run dev
```

默认访问地址：

```text
http://127.0.0.1:5174/
```

## 构建

```bash
npm run build
```

构建产物在 `dist/`，可以部署到 GitHub Pages、Vercel、Nginx 或其他静态托管服务。

## GitHub Pages

仓库推送到 GitHub 后，进入仓库：

1. 打开 `Settings`。
2. 进入 `Pages`。
3. `Build and deployment` 选择 `GitHub Actions`。
4. 推送到 `main` 分支后会自动构建并发布。

发布地址通常是：

```text
https://你的用户名.github.io/仓库名/
```
