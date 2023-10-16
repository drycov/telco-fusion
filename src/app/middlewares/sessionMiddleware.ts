import { Request, Response, NextFunction } from "express";
import { Session } from "express-session";

interface CustomSession extends Session {
  isAuthenticated: boolean;
  user: any; // Замените на тип вашего пользователя
  token: any;
}

const sessionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const session = req.session as CustomSession;
  console.log(session);
  // Установим isAuthenticated в false, если не установлено
  if (session.isAuthenticated === undefined) {
    session.isAuthenticated = false;
  }

  res.locals.session = {
    isAuthenticated: session.isAuthenticated,
    user: session.user || null,
    // cart: session.cart || []
  };

  next();
};

export default sessionMiddleware;
