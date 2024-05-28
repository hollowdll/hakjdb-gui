export interface DatabaseInfo {
  name: string,
  createdAt: string,
  updatedAt: string,
  dataSize: string,
  keyCount: string,
}

export interface Databases {
  dbNames: string[],
}