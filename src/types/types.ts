export interface Label {
  text: string;
}

export interface Account {
  label: Label[];
  type: 'LDAP' | 'Local';
  login: string;
  password: string | null;
  validLogin: boolean;
  validPassword: boolean;
  touched: boolean;
}
