import { IPicGo, IPlugin, IPluginConfig, IPicGoPlugin } from 'picgo';
import { TinyPngCompress } from './compress/tinypngweb';
import { TinyPngKeyCompress, RefreshTinyPngConfig } from './compress/tinypng/index';
import { ImageminCompress } from './compress/imagemin';
import { Image2WebPCompress } from './compress/image2webp';
import { WebPConverterCompress } from './compress/webpConverter';
import { CompressType } from './config';
import { getUrlInfo } from './utils';
import { IConfig } from './interface';
import { SkipCompress } from './compress/skip';
import { PROJ_CONF } from './config';

// Allowed image file extensions
const ALLOW_EXTNAME = ['.png', '.jpg', '.webp', '.jpeg'];

const CONF_KEYS: ['Compress Type', 'Auto Refresh TinyPng Key Across Months', 'TinyPng API Key'] = [
  'Compress Type',
  'Auto Refresh TinyPng Key Across Months',
  'TinyPng API Key',
];

// Get configuration from ctx
const getConfig = (ctx: IPicGo): IConfig => {
  return ctx.getConfig(PROJ_CONF) || ctx.getConfig(`picgo-plugin-${PROJ_CONF}`);
};

const getConfigData = (ctx: IPicGo) => {
  const config = getConfig(ctx);
  return {
    compress: config[CONF_KEYS[0]] || CompressType.tinypng,
    refresh: config[CONF_KEYS[1]] || false,
    tinyKey: config[CONF_KEYS[2]] || null,
  };
};

// Compression handler function
const handle = async (ctx: IPicGo): Promise<IPicGo> => {
  // Get compression configuration
  // const config: IConfig = getConfig(ctx);
  // const compress = config[CONF_KEYS[0]] || CompressType.tinypng;
  // const refresh = config[CONF_KEYS[1]] || false;
  // const tinyKey = config[CONF_KEYS[2]] || null;
  const { compress, refresh, tinyKey } = getConfigData(ctx);

  // Log compression setting
  ctx.log.info('Compression type:', compress);

  // Process images
  const tasks = ctx.input.map((imageUrl) => {
    // Log image URL
    ctx.log.info('Image URL:', imageUrl);
    const info = getUrlInfo(imageUrl);
    // Log image information
    ctx.log.info('Image info:', JSON.stringify(info));
    if (ALLOW_EXTNAME.includes(info.extname.toLowerCase())) {
      switch (compress) {
        case CompressType.imagemin:
          return ImageminCompress(ctx, { imageUrl });
        case CompressType.image2webp:
          return Image2WebPCompress(ctx, { imageUrl });
        case CompressType.webp_converter:
          return WebPConverterCompress(ctx, { imageUrl });
        case CompressType.tinypng:
        default:
          return tinyKey
            ? TinyPngKeyCompress(ctx, { imageUrl, key: tinyKey }, refresh)
            : TinyPngCompress(ctx, { imageUrl });
      }
    }
    // Log unsupported format warning
    ctx.log.warn('Unsupported image format. Skipping compression.');
    return SkipCompress(ctx, { imageUrl });
  });

  return Promise.all(tasks).then((output) => {
    // Log compressed image information
    ctx.log.info(
      'Compressed image info:',
      JSON.stringify(
        output.map((item) => ({
          fileName: item.fileName,
          extname: item.extname,
          height: item.height,
          width: item.width,
        })),
      ),
    );

    // Set output images
    ctx.output = output;
    return ctx;
  });
};

// Export plugin function
const CompressTransformers: IPicGoPlugin = (ctx: IPicGo) => {
  return {
    transformer: PROJ_CONF,
    register(ctx: IPicGo) {
      // Register compression transformer
      ctx.helper.transformer.register(PROJ_CONF, { handle });
    },
    guiMenu(ctx: IPicGo) {
      const success = (ctx: IPicGo, guiApi: any, info: string) => {
        ctx.log.success(info);
        guiApi.showNotification({
          title: 'Success',
          body: info,
        });
      };
      return [
        {
          label: 'Refresh active TinyPng API Keys',
          async handle(ctx, guiApi) {
            await RefreshTinyPngConfig(ctx).then((info) => success(ctx, guiApi, info));
          },
        },
        {
          label: 'Clear cache of TinyPng API Keys',
          async handle(ctx, guiApi) {
            const info = await RefreshTinyPngConfig(ctx, true).then((info) => success(ctx, guiApi, info));
          },
        },
      ];
    },
    config(ctx: IPicGo): IPluginConfig[] {
      // let config: IConfig = getConfig(ctx);
      const { compress, refresh, tinyKey } = getConfigData(ctx);

      // input, confirm, password, list, checkbox
      return [
        {
          name: CONF_KEYS[0],
          type: 'list',
          message: 'Choose compression library',
          choices: Object.values(CompressType),
          default: compress,
          required: true,
        },
        {
          name: CONF_KEYS[1],
          type: 'confirm',
          default: refresh,
          required: false,
          when(answer: any): boolean {
            return answer.compress === CompressType.tinypng;
          },
        },
        {
          name: CONF_KEYS[2],
          type: 'input',
          message: 'Enter API key(s). This is required if tinypng. Separate multiple keys with commas.',
          default: tinyKey,
          required: false,
          when(answer: any): boolean {
            return answer.compress === CompressType.tinypng;
          },
        },
      ];
    },
    getHandle(ctx: IPicGo): IPlugin {
      return { handle };
    },
  };
};

export default CompressTransformers;
/**
 * CommonJs module exports, if do not this, the plugin will not be loaded
 */
module.exports = CompressTransformers;
