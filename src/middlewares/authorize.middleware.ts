import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Container from 'typedi';

import { GENERAL } from '../shared/constants/constants';
import { NotAuthorizedError } from '../errors/not-authorized.error';
import { TokenBlackListRepository } from '../repository/token-black-list.repository';

interface UserPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  uuid: number;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const authorize = async (req: Request, res: Response, next: NextFunction) => {
  const tokenBlackListRepository = Container.get(TokenBlackListRepository);

  if (!req.headers.authorization) {
    throw new NotAuthorizedError();
  }

  const token = req.headers.authorization.toString();

  if (await tokenBlackListRepository.getToken(token)) {
    throw new NotAuthorizedError();
  }

  try {
    const payload: any = jwt.verify(token, GENERAL.ENCRYPTION_TOKEN);
    req.currentUser = {
      uuid: payload.uuid,
      email: payload.email,
      lastName: payload.lastName,
      firstName: payload.firstName,
      id: payload.id,
    };
  } catch (err) {
    throw new NotAuthorizedError();
  }

  next();
};
