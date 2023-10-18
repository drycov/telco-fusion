import { Request, Response, NextFunction } from 'express';
interface MyRequest extends Request {
    user?: any; // тип пользователя может быть адаптирован под ваши нужды
  }
const aclMiddleware = (allowedRoles: string[]) => {
  return (req: MyRequest, res: Response, next: NextFunction) => {
    // Check if user has a role
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if the allowed roles include "any" or if the user's role is allowed
    if (allowedRoles.includes('any') || allowedRoles.includes(userRole)) {
      // User has the required role or "any" role, proceed to the next middleware or route handler
      next();
    } else {
      return res.status(403).json({ error: 'Access denied' });
    }
  };
};

export default aclMiddleware;
