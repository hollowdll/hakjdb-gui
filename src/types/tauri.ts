export type TauriInvokeCommands = {
  connect: string;
  disconnect: string;
  getServerInfo: string;
  getServerLogs: string;
  getAllDatabases: string;
  getDatabaseInfo: string;
  createDatabase: string;
  deleteDatabase: string;
  changeDatabase: string;
  getAllKeys: string;
  getKeyType: string;
  deleteKeys: string;
  deleteAllKeys: string;
  getString: string;
  setString: string;
  setHashMap: string;
  getAllHashMapFieldsAndValues: string;
  deleteHashMapFields: string;
  getHashMapFieldValues: string;
  resetAuthToken: string;
  setTLSCertPath: string;
  openFile: string;
  authenticate: string;
  unaryEcho: string;
  handleSettings: string;
  settingsSetTheme: string;
};

export type TauriListenEvents = {
  newConnection: string;
  disconnect: string;
  setDarkMode: string;
};
