import { PicGo, IPicGo, IPluginConfig, IPicGoPlugin, IPicGoPluginInterface } from 'picgo';
import { CompressType } from '../src/config';
import CompressTransformers from '../src/index';

jest.mock('../src/compress/tinypngweb', () => ({
  TinyPngCompress: jest.fn().mockReturnValue({
    fileName: 'compressed.png',
    extname: '.png',
    height: 100,
    width: 200,
  }),
}));

jest.mock('../src/compress/tinypng/index', () => ({
  TinyPngKeyCompress: jest.fn().mockReturnValue({
    fileName: 'compressed.jpg',
    extname: '.jpg',
    height: 150,
    width: 300,
  }),
}));

jest.mock('../src/compress/imagemin', () => ({
  ImageminCompress: jest.fn().mockReturnValue({
    fileName: 'compressed.webp',
    extname: '.webp',
    height: 200,
    width: 400,
  }),
}));

jest.mock('../src/compress/image2webp', () => ({
  Image2WebPCompress: jest.fn().mockReturnValue({
    fileName: 'compressed.jpeg',
    extname: '.jpeg',
    height: 250,
    width: 500,
  }),
}));

jest.mock('../src/compress/skip', () => ({
  SkipCompress: jest.fn().mockReturnValue({
    fileName: 'image.gif',
    extname: '.gif',
    height: null,
    width: null,
  }),
}));

describe('CompressTransformers', () => {
  let ctx: IPicGo;
  let plugin: IPicGoPluginInterface;

  beforeEach(() => {
    ctx = new PicGo();
    plugin = CompressTransformers(ctx);
    if (!plugin.transformer) {
      return fail('transformer is not defined');
    }
    plugin.register(ctx);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register the compress transformer', () => {
      expect(ctx.helper.transformer.get(plugin.transformer ?? '')).toEqual(plugin.getHandle());
    });
  });

  describe('config', () => {
    it('should return the correct config options', () => {
      const pluginName = plugin.transformer ?? '';

      expect(ctx.getConfig(pluginName)).toBeUndefined();

      ctx.setConfig({ [pluginName]: (plugin.config ?? ((ctx: IPicGo) => []))(ctx) });
      const config = ctx.getConfig(pluginName) as IPluginConfig[];
      expect(config).toEqual((plugin.config ?? ((ctx: IPicGo) => []))(ctx));

      expect(config).toHaveLength(2);
      expect(config[0].name).toBe('compress');
      expect(config[0].type).toBe('list');
      expect(config[0].choices).toEqual(Object.keys(CompressType));
      expect(config[0].default).toBe(CompressType.tinypng);
      expect(config[1].name).toBe('key');
      expect(config[1].type).toBe('input');
      expect(config[1].default).toBe(null);
    });
  });
});

function fail(reason = 'fail was called in a test.') {
  throw new Error(reason);
}
