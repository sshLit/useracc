export interface Account {
  label: '';
  type: 'LDAP' | 'Local';
  login: string;
  password?: string;
  valid: boolean;
  touched: boolean;
}
