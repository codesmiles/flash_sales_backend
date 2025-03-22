import { type Request } from 'express';
import {UserRoles} from "../Helper"

type UserTokenDecrypted = {
  email: string;
  id: string;
  role: UserRoles.ADMIN;
};

export interface CustomRequest extends Request {
  user: UserTokenDecrypted;
}