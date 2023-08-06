import {Plugin} from "vite";
import path from "path";
import fs from "fs";
import ChromeExtension from "crx";
import chalk from "chalk"

const join = path.join;

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

let crxBuildConfiguration: CrxBuild = {
  updateFilename: 'update.xml',
  updateUrl: 'http://localhost:8000/',
} as CrxBuild;

let runtimePath = '';

/**
 * @description vite打包的时候将front-end back-end压缩，得到生产环境压缩包
 * @time 2022.05.18
 * @author willye
 */
export default (opts: CrxBuild): Plugin[] => {
  crxBuildConfiguration = {...crxBuildConfiguration, ...opts};

  /**
   * @description 配置打包生成结束之后，将文件压缩
   */
  const postPlugin: Plugin = {
    name: 'vite:compress',
    apply: 'build',
    enforce: 'post',
    configResolved({ root, build: { ssr } }) {
      runtimePath = path.resolve(root);
      if (ssr) return;
    },
    writeBundle: async () => {
      await entry(crxBuildConfiguration);
    }
  };

  return [postPlugin];
};

/**
 * 入口函数
 * @param config 配置信息
 */
const entry = async (config: CrxBuild) => {
  const crxName = config.name + '.crx';
  const crx = new ChromeExtension({
    codebase: config.updateUrl + '/' + crxName,
    privateKey: fs.readFileSync(config.keyFile),
  });
  try {
    await buildCrx(crx, config);
  }catch (e) {
    chalk.red('build crx error: ' + e);
  }
}

const buildCrx  = async (crx: any, config: CrxBuild) => {
  await crx.load(config.contentPath);
  const buffer = await crx.pack();
  // 检查config.outputPath是否存在，不存在则创建
  if (!fs.existsSync(config.outputPath)) {
    fs.mkdirSync(config.outputPath);
  }
  const updateXML = crx.generateUpdateXML();
  const updateFile = join(config.outputPath, config.updateFilename);
  // 将updateXML写入到updateFile中
  fs.writeFileSync(updateFile, updateXML);
  chalk.green('wrote updateFile to ' + updateFile);
  // 将buffer写入到crxFile中
  const crxFile = join(config.outputPath, config.name + '.crx');
  fs.writeFileSync(crxFile, buffer);
  chalk.green('wrote crxFile to ' + crxFile);
}