import { Request, Response, NextFunction } from "express";

const sessionMiddleware = (req: Request, res: Response, next: NextFunction) => {
    res.locals.session = {
        isAuthenticated: req.session!.isAuthenticated || false,
        user: req.session!.user || null,
        lang: req.session!.lang || null
    };
    console.log(req.session!.lang)
    next();
}


export default sessionMiddleware;
