export const TINYPNG_UPLOAD_URL = 'https://api.tinify.com/shrink';

export const TINYPNG_WEBUPLOAD_URL = 'https://tinify.cn/web/shrink';

export enum CompressType {
  A = 'tinypng',
  B = 'imagemin',
  C = 'imagemin-webp',
  D = 'webp-converter',
}

export enum GifCompressType {
  A = 'webp-converter',
  B = 'imagemin-gif2webp',
}

export const PROJ_CONF = 'compress-next';
