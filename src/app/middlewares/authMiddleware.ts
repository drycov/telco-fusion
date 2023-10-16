import { Request, Response, NextFunction } from 'express';
import { Session } from "express-session";

import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../configs/web.config';
import getUserData from '../utils/getUserData';
import getUserRole from '../utils/getUserRole';


interface CustomSession extends Session {
    isAuthenticated: boolean;
    user: any; // Замените на тип вашего пользователя
    token: any;
}

declare global {
    namespace Express {
        interface Request {
            user?: any; // Replace with your user type
        }
    }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const session = req.session as CustomSession;
    console.log(session);
    const token = session?.token;

    if (!token || !session.isAuthenticated) {
        return res.redirect('/login');
    }
    try {
        const decoded = jwt.verify(session.token, process.env.sesionKey || config.sesionKey) as JwtPayload;
        req.user = decoded;
        let userdata = getUserData(decoded.username)
        req.user = {
            ...req.user,
            role: getUserRole(decoded.username),
            ...userdata
            // другие свойства пользователя
        };  // Добавляем информацию о пользователе в объект запроса
        session.user = req.user;
        next();
    } catch (err) {
        return res.redirect('/login');
    }

}

export default authMiddleware;
