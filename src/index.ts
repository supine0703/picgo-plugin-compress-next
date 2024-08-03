import { IPicGo, IPlugin, IPluginConfig, IPicGoPlugin } from 'picgo';
import { TinyPngCompress } from './compress/tinypngweb';
import { TinyPngKeyCompress, RefreshTinyPngConfig } from './compress/tinypng/index';
import { ImageminCompress } from './compress/imagemin';
import { Image2WebPCompress } from './compress/image2webp';
import { CompressType } from './config';
import { getUrlInfo } from './utils';
import { IConfig } from './interface';
import { SkipCompress } from './compress/skip';
import { PROJ_CONF } from './config';

// Allowed image file extensions
const ALLOW_EXTNAME = ['.png', '.jpg', '.webp', '.jpeg'];

// Get configuration from ctx
const getConfig = (ctx: IPicGo): IConfig => {
  return ctx.getConfig(PROJ_CONF) || ctx.getConfig(`picgo-plugin-${PROJ_CONF}`);
};

// Compression handler function
const handle = async (ctx: IPicGo): Promise<IPicGo> => {
  // Get compression configuration
  const config: IConfig = getConfig(ctx);
  const compress = config?.compress;
  const key = config?.key || config?.tinypngKey;

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
        case CompressType.tinypng:
        default:
          return key ? TinyPngKeyCompress(ctx, { imageUrl, key }) : TinyPngCompress(ctx, { imageUrl });
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
      // Get compression key(s)
      const config: IConfig = getConfig(ctx);
      const key = config?.key || config?.tinypngKey;
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
            await RefreshTinyPngConfig(ctx, { key }).then((info) => success(ctx, guiApi, info));
          },
        },
        {
          label: 'Clear cache of TinyPng API Keys',
          async handle(ctx, guiApi) {
            const info = await RefreshTinyPngConfig(ctx, { key }, true).then((info) => success(ctx, guiApi, info));
          },
        },
      ];
    },
    config(ctx: IPicGo): IPluginConfig[] {
      let config: IConfig = getConfig(ctx);

      // input, confirm, password, list, checkbox
      return [
        {
          name: 'compress',
          type: 'list',
          message: 'Choose compression library',
          choices: Object.keys(CompressType),
          default: config?.compress || CompressType.tinypng,
          required: true,
        },
        {
          name: 'key',
          type: 'input',
          message: 'Enter API key(s). This is required if tinypng. Separate multiple keys with commas.',
          default: config?.key || config?.tinypngKey || null,
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
