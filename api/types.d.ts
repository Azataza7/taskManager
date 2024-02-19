import { Request } from 'express';

export interface typeUser {
  username: string;
  password: string;
  token: string;
}

export interface typeUserReq extends typeUser {
  _id: Object;
}

export type typeUserWithoutToken = Omit<typeUser, 'token'>

export interface RequestWithUser extends Request {
  user?: typeUserReq
}

export interface typeTask {
  _id: string;
  user: string;
  title: string;
  description: string;
  status: string;
}