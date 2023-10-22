import { Request, Response, NextFunction } from 'express';
interface MyRequest extends Request {
  user?: any; // тип пользователя может быть адаптирован под ваши нужды
}
const aclMiddleware = (allowedRoles: string[]) => {
  return (req: MyRequest, res: Response, next: NextFunction) => {
    // Check if user has a role
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(403).render("error", {
        title: req.__("labelpageTitles.LabelError"),
        name: req.__("labelpageTitles.LabelError"),
        breadcrumbs: [
          { label: req.__("labelpageTitles.labelHome"), url: "/" },
          { label: res.statusCode.toString(), url: null },
        ],
        messages: {
          pageTitle: req.__("erorMesages.403.pageTitle"),
          status: res.statusCode,
          text: req.__("erorMesages.403.text"),
        },
      });
      // res.status(500).send('Internal Server Error');
    };


    // Check if the allowed roles include "any" or if the user's role is allowed
    if (allowedRoles.includes('any') || allowedRoles.includes(userRole)) {
      // User has the required role or "any" role, proceed to the next middleware or route handler
      next();
    } else {
      return res.status(403).render("error", {
        title: req.__("labelpageTitles.LabelError"),
        name: req.__("labelpageTitles.LabelError"),
        breadcrumbs: [
          { label: req.__("labelpageTitles.labelHome"), url: "/" },
          { label: res.statusCode.toString(), url: null },
        ],
        messages: {
          pageTitle: req.__("erorMesages.403.pageTitle"),
          status: res.statusCode,
          text: req.__("erorMesages.403.text"),
        },
      });
    }
  };
};

export default aclMiddleware;
