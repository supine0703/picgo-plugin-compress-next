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
  [IConfigKeys.A]: string;
  [IConfigKeys.B]: string;
  [IConfigKeys.G]: boolean;
  [IConfigKeys.H]: string;
}

export enum IConfigKeys {
  // required
  A = 'Compress Type',
  B = 'Gif compress Type',
  // optional
  G = 'Auto Refresh TinyPng Key Across Months',
  H = 'TinyPng API Key',
}
