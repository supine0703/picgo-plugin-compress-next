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
  [IConfigKeys.B]: boolean;
  [IConfigKeys.C]: string;
}

export enum IConfigKeys {
  A = 'Compress Type',
  B = 'Auto Refresh TinyPng Key Across Months',
  C = 'TinyPng API Key',
}
