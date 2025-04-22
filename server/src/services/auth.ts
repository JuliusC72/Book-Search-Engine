import type { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
  data: {
    _id: string;
    username: string;
    email: string;
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    const secretKey = process.env.JWT_SECRET_KEY || '';

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }

      req.user = (user as JwtPayload).data;
      return next();
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign({ data: payload }, secretKey, { expiresIn: '1h' });
};
interface JwtPayloadData {
  _id: string;
  username: string;
  email: string;
}

interface JwtPayloadWithData {
  data: JwtPayloadData;
}

export const authMiddleware = ({ req }: { req: Request }) => {
  let token = req.body?.token || req.query?.token || req.headers?.authorization;
  
  if (req.headers?.authorization) {
    token = token.split(' ').pop().trim();
  }
  
  if (!token) {
    return req;
  }
  
  try {
    const secretKey = process.env.JWT_SECRET_KEY || '';
    const decoded = jwt.verify(token, secretKey) as JwtPayloadWithData;
    req.user = decoded.data;
  } catch {
    console.log('Invalid token');
  }
  
  return req;
};