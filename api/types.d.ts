export interface typeUser {
  username: string;
  password: string;
  token: string;
}

export type typeUserWithoutToken = Omit<typeUser, 'token'>