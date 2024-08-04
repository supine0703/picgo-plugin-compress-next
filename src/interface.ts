export interface ImageInfo {
  fileName: string;
  extname: string;
  buffer: Buffer;
  width: number;
  height: number;
}

export interface CommonParams {
  imageUrl: string;
}

export interface IConfig {
  nameType: string;
  'Compress Type': string;
  'Auto Refresh TinyPng Key Across Months': boolean;
  'TinyPng API Key': string;
}
