export interface ConnectionInfo {
  host: string;
  port: number;
  defaultDb: string;
  password: string;
  caCertFilePath: string;
  clientCertFilePath: string;
  clientKeyFilePath: string;
  usePassword: boolean;
  useTLS: boolean;
  useClientCertAuth: boolean;
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
