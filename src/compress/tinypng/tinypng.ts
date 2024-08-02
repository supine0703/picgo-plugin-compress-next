import * as fs from 'fs-extra';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import Base64 from 'crypto-js/enc-base64.js';
import Utf8 from 'crypto-js/enc-utf8.js';
import { IPicGo } from 'picgo';
import { getImageBuffer, isNetworkUrl } from '../../utils';
import { TINYPNG_UPLOAD_URL } from '../../config';

interface TinyPngOptions {
  keys: string[];
  ctx: IPicGo;
}

interface TinyCacheConfig {
  [key: string]: number;
}

const errCodes = [-1, -2];

class TinyPng {
  // private cacheConfigPath = join(dirname(fileURLToPath(import.meta.url)), 'config.json'); // ES6
  private cacheConfigPath = join(__dirname, 'config.json'); // CommonJs
  private options!: TinyPngOptions;
  private IPicGo!: IPicGo;

  // Initialize TinyPng instance with options
  async init(options: TinyPngOptions) {
    this.IPicGo = options.ctx;
    this.options = options;
    await this.readOrWriteConfig(this.options.keys);
    this.IPicGo.log.info('TinyPng initialized');
  }

  // Upload image to TinyPng service
  async upload(url: string) {
    this.IPicGo.log.info('TinyPng upload started');
    const key = await this.getKey();
    if (isNetworkUrl(url)) {
      return this.uploadImage({ url, originalUrl: url, key });
    } else {
      const buffer = await getImageBuffer(this.IPicGo, url);
      return this.uploadImage({ key, originalUrl: url, buffer });
    }
  }

  // Get key with available usage count
  private async getKey() {
    const config = await this.readOrWriteConfig();
    const innerKeys = Object.keys(config).filter((key) => !errCodes.includes(config[key]));
    if (innerKeys.length <= 0) {
      throw new Error('No available keys');
    }
    return innerKeys[0];
  }

  // Upload image with specified options
  private uploadImage(options: { key: string; originalUrl: string; url?: string; buffer?: Buffer }): Promise<Buffer> {
    this.IPicGo.log.info('Using TinyPng key:', options.key);
    const bearer = Base64.stringify(Utf8.parse(`api:${options.key}`));
    const headersObj = {
      Host: 'api.tinify.com',
      Authorization: `Basic ${bearer}`,
    };
    let bodyObj = {};
    if (options.url) {
      this.IPicGo.log.info('Uploading network image to TinyPng');
      Object.assign(headersObj, {
        'Content-Type': 'application/json',
      });
      Object.assign(bodyObj, {
        source: { url: options.url },
      });
    }
    if (options.buffer) {
      this.IPicGo.log.info('Uploading local image to TinyPng');
      bodyObj = options.buffer;
    }
    return this.IPicGo.request({
      method: 'POST',
      url: TINYPNG_UPLOAD_URL,
      json: true,
      resolveWithFullResponse: true,
      headers: headersObj,
      body: bodyObj,
    })
      .then((response) => {
        const count: number = parseInt(response.headers['compression-count'] as any);
        this.setConfig(options.key, count);
        if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
          this.IPicGo.log.success('TinyPng upload successful, status code:', response.statusCode);
          this.IPicGo.log.info('Compression count:', count);
          this.IPicGo.log.info('Compression url:', response.headers.location);
          return getImageBuffer(this.IPicGo, response.headers.location as any);
        }
        if (response.statusCode === 429) {
          this.setConfig(options.key, errCodes[0]);
          return this.upload(options.originalUrl);
        }
      })
      .catch((err) => {
        this.IPicGo.log.warn('this key is invalid, status code:', err.response.statusCode || err.response.status);
        return this.setConfig(options.key, errCodes[1]).then(() => {
          return this.upload(options.originalUrl) as any;
        });
      });
  }

  // Set configuration with key and usage count
  private async setConfig(key: string, num: number) {
    const config = await this.readOrWriteConfig();
    config[key] = num;
    await fs.writeJSON(this.cacheConfigPath, config);
  }

  // Read or write configuration file
  private async readOrWriteConfig(keys?: string[]): Promise<TinyCacheConfig> {
    const config: TinyCacheConfig = {};
    if (await fs.pathExists(this.cacheConfigPath)) {
      Object.assign(config, await fs.readJSON(this.cacheConfigPath));
    } else {
      await fs.writeJSON(this.cacheConfigPath, {});
    }
    if (keys) {
      await fs.writeJSON(
        this.cacheConfigPath,
        keys.reduce((res, key) => {
          if (!res[key]) {
            res[key] = 0;
          }
          return res;
        }, config),
      );
    }
    return config;
  }
}

export default new TinyPng();
