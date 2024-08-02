import { IPicGo } from 'picgo';
import { CommonParams, ImageInfo } from '../interface';
import { TINYPNG_WEBUPLOAD_URL } from '../config';
import { getImageBuffer, getImageInfo } from '../utils';

/**
 * Compress image using TinyPngWeb service
 * @param ctx The PicGo instance.
 * @param imageUrl The URL of the image to be compressed.
 * @returns A Promise that resolves to an ImageInfo object containing information about the compressed image.
 */
export function TinyPngCompress(ctx: IPicGo, { imageUrl }: CommonParams): Promise<ImageInfo> {
  /**
   * This cannot use and return 404(not found) or 413(too large) error, so I break the code here.
   * @author: 李宗霖 <email: supine0703@outlook.com> or <github: https://github.com/supine0703>
   */
  throw new Error('Please set the TinyPNG API Key. TinyPngWeb is cannot use, maybe you can try?');
  
  return getImageBuffer(ctx, imageUrl).then((buffer) => {
    ctx.log.info('TinyPngWeb compression started');
    return ctx
      .request({
        url: TINYPNG_WEBUPLOAD_URL,
        method: 'POST',
        headers: getHeaders(),
        body: buffer,
        resolveWithFullResponse: true,
      })
      .then((resp) => {
        if (resp.headers.location) {
          ctx.log.info('TinyPngWeb compression successful:', resp.headers.location);
          ctx.log.info('Downloading TinyPng image');
          return getImageBuffer(ctx, resp.headers.location);
        }
        // If compression failed, throw an error
        throw new Error('TinyPngWeb upload failed');
      })
      .then((buffer) => {
        return getImageInfo(imageUrl, buffer);
      });
  });
}

// Generate random user agent
function getRandomUserAgent(): string {
  const chromeVersion = `59.0.4044.${59 + Math.round(Math.random() * 10)}`;
  const safariVersion = `537.36`;
  return `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVersion} Safari/${safariVersion}`;
}

function getHeaders(): Record<string, string> {
  return {
    origin: TINYPNG_WEBUPLOAD_URL,
    referer: TINYPNG_WEBUPLOAD_URL,
    'content-type': 'application/x-www-form-urlencoded',
    'user-agent': getRandomUserAgent(),
  };
}
