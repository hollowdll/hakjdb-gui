export interface ConnectionInfo {
  host: string;
  port: number;
  defaultDb: string;
  password: string;
  tlsCertFilePath: string;
  isUsePassword: boolean;
  isUseTLS: boolean;
  isConnected: boolean;
}

export interface NavItem {
  text: string;
  href: string;
}

export interface NavItemNames {
  connection: string;
  server: string;
  databases: string;
  keys: string;
}
