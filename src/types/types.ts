export interface ConnectionInfo {
  host: string;
  port: number;
  defaultDb: string;
  password: string;
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
