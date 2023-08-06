# Squirrel Vite Plugin File Manager

🎉 vite-plugin-crx-build 是一款用于打包CRX浏览器插件的vite插件，可以将压缩包打包成crx文件

## 安装

```bash
npm install @allahbin/vite-plugin-crx-build --save-dev
```

或者yarn

```bash
yarn add @allahbin/vite-plugin-crx-build --dev
```

## 使用方法

```typescript
// Path: path/to/vite.config.ts
import {defineConfig} from 'vite';
import CrxBuild from '@allahbin/vite-plugin-crx-build';

export default defineConfig({
    plugins: [
        CrxBuild({
            keyFile: 'pem/allahbin.pem',
            contentPath: path.join(distPath, buildFileName),
            outputPath: path.join(extensionPath),
            name: buildFileName,
        })
    ]
});
```

## 参数说明

```ts
type CrxBuild = {
    /**
     * 签名文件
     */
    keyFile: string;
    /**
     * 打包后的代码文件夹
     */
    contentPath: string;
    /**
     * 打包后的crx文件夹
     */
    outputPath: string;
    /**
     * 打包后的crx文件名
     */
    name: string;
    /**
     * 更新地址
     */
    updateUrl?: string;
    /**
     * 更新描述文件
     */
    updateFilename?: string;
}
```

## License

allahbin © 2023 - [MIT License](LICENSE)
