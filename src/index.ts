import { IPicGo, IPlugin, IPluginConfig, IPicGoPlugin } from 'picgo';
import { TinypngCompress } from './compress/tinypngweb';
import { TinypngKeyCompress } from './compress/tinypng/index';
import { ImageminCompress } from './compress/imagemin';
import { Image2WebPCompress } from './compress/image2webp';
import { CompressType } from './config';
import { getUrlInfo } from './utils';
import { IConfig } from './interface';
import { SkipCompress } from './compress/skip';

// Allowed image file extensions
const ALLOW_EXTNAME = ['.png', '.jpg', '.webp', '.jpeg'];

// Compression handler function
const handle = async (ctx: IPicGo): Promise<IPicGo> => {
  // Get compression configuration
  const config: IConfig = ctx.getConfig('compress-webp-lossless');
  const compress = config?.compress;
  const key = config?.key || config?.tinypngKey;

  // Log compression setting
  ctx.log.info('Compression type: ' + compress);

  // Process images
  const tasks = ctx.input.map((imageUrl) => {
    // Log image URL
    ctx.log.info('Image URL: ' + imageUrl);
    const info = getUrlInfo(imageUrl);
    // Log image information
    ctx.log.info('Image info: ' + JSON.stringify(info));
    if (ALLOW_EXTNAME.includes(info.extname.toLowerCase())) {
      switch (compress) {
        case CompressType.tinypng:
          return key ? TinypngKeyCompress(ctx, { imageUrl, key }) : TinypngCompress(ctx, { imageUrl });
        case CompressType.imagemin:
          return ImageminCompress(ctx, { imageUrl });
        case CompressType.image2webp:
          return Image2WebPCompress(ctx, { imageUrl });
        default:
          return key ? TinypngKeyCompress(ctx, { imageUrl, key }) : TinypngCompress(ctx, { imageUrl });
      }
    }
    // Log unsupported format warning
    ctx.log.warn('Unsupported image format. Skipping compression.');
    return SkipCompress(ctx, { imageUrl });
  });

  return Promise.all(tasks).then((output) => {
    // Log compressed image information
    ctx.log.info(
      'Compressed image info: ' +
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
    transformer: 'compress-webp-lossless',
    register(ctx: IPicGo) {
      // Register compression transformer
      ctx.helper.transformer.register('compress-webp-lossless', { handle });
    },
    config(ctx: IPicGo): IPluginConfig[] {
      let config: IConfig = ctx.getConfig('compress-webp-lossless');

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
          message: 'Enter API key(s). Leave blank to use Web API. Separate multiple keys with commas.',
          default: config?.key || config?.tinypngKey || null,
          required: false,
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
