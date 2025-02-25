export interface Account {
  label: { text: string }[];
  type: 'LDAP' | 'Local';
  login: string;
  password?: string;
  valid: boolean;
  touched: boolean;
}
