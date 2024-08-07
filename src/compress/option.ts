import { join } from 'path';
import * as fs from 'fs-extra';

interface Option {
  reset: string;
  warn: string[];
  module: {
    [key: string]: Module;
  };
}

interface Module {
  url: string;
  option: {} | string;
  recommend?: ({} | string)[];
  annotation?: string | string[];
}

const defaultOption = {
  reset: 'not',
  warn: [
    'Do not modify this file unless you know what you are doing.',
    'If you modify or delete the `reset` option, the file will be reset the next time it is accessed',
    'You can use the url below to learn how to configure',
  ],
  module: {
    'imagemin-upng': {
      url: 'https://www.npmjs.com/package/imagemin-upng#api',
      option: { cnum: 256 },
      recommend: [{ cnum: 0 }, { cnum: 2048 }, { cnum: 1024 }, { cnum: 512 }, { cnum: 256 }],
      annotation: [
        'The cnum option is the number of colors in the palette (0=lossless). ',
        'The larger the cnum value, the richer the color, the larger the file.',
      ],
    },
    'imagemin-mozjpeg': {
      url: 'https://www.npmjs.com/package/imagemin-mozjpeg#api',
      option: { quality: 75, progressive: true },
      recommend: [
        { quality: 85, progressive: true, tune: 'ms-ssim' },
        { quality: 65, progressive: true, tune: 'hvs-psnr' },
        { quality: 45, progressive: true, trellis: false, trellisDC: false },
      ],
      annotation: ['The smaller the mass, the larger the unit block'],
    },
    'imagemin-webp': {
      url: 'https://www.npmjs.com/package/imagemin-webp#api',
      option: { quality: 80, method: 6 },
      recommend: [
        { method: 6, lossless: true, autoFilter: true },
        { quality: 100, method: 6 },
        { quality: 90, method: 6 },
        { quality: 80, method: 6 },
        { quality: 70, method: 6 },
      ],
      annotation: [
        'Lossless compression of detailed images, webp volume will be greatly improved.',
        'The imagemin-webp and the webp-converter-cwebp use the same webp converter',
        '-af === autoFilter',
      ],
    },
    'imagemin-gif2webp': {
      url: 'https://www.npmjs.com/package/imagemin-gif2webp#api',
      option: { quality: 80, method: 6, lossy: true, minimize: true },
      recommend: [
        { quality: 70, method: 6, lossy: true },
        { quality: 60, method: 6, lossy: true },
      ],
    },
    'webp-converter-cwebp': {
      url: 'https://developers.google.com/speed/webp/docs/cwebp',
      option: '-q 80 -m 6 -mt -af',
      recommend: [
        '-lossless -m 6 -mt',
        '-q 100 -m 6 -mt -af',
        '-q 90 -m 6 -mt -af',
        '-q 80 -m 6 -mt -af',
        '-q 70 -m 6 -mt -af',
      ],
      annotation: [
        'Lossless compression of detailed images, webp volume will be greatly improved.',
        'The imagemin-webp and the webp-converter-cwebp use the same webp converter',
        '-af === autoFilter',
      ],
    },
    'webp-converter-gwebp': {
      url: 'https://developers.google.com/speed/webp/docs/gif2webp',
      option: '-q 80 -m 6 -lossy -min_size',
      recommend: ['-q 70 -m 6 -lossy', '-q 60 -m 6 -lossy'],
    },
  },
};

const filePath = join(__dirname, 'option.json');

export type OptionModule = keyof typeof defaultOption.module;

export async function resetOption(): Promise<void> {
  await fs.writeJSON(filePath, defaultOption);
}

export async function getOptionFilePath(): Promise<string> {
  return await fs.pathExists(filePath).then((exists) => {
    if (!exists) {
      resetOption();
    }
    return filePath;
  });
}

export async function getOption(module: OptionModule): Promise<{} | string> {
  if (await fs.pathExists(filePath)) {
    const option: Option = await fs.readJSON(filePath);
    if (option?.reset === 'not' && option?.module?.[module]?.option) {
      return option.module[module].option;
    }
  }
  return resetOption().then(() => defaultOption.module[module].option);
}
