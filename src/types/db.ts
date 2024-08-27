export interface Database {
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  dataSize: string;
  keyCount: string;
}

export interface Databases {
  dbNames: string[];
}
