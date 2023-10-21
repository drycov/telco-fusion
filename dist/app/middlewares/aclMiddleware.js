"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aclMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        // Check if user has a role
        const userRole = req.user?.role;
        if (!userRole) {
            return res.status(403).render("error", {
                title: req.t("labelpageTitles.LabelError"),
                name: req.t("labelpageTitles.LabelError"),
                breadcrumbs: [
                    { label: req.t("labelpageTitles.labelHome"), url: "/" },
                    { label: res.statusCode.toString(), url: null },
                ],
                messages: {
                    pageTitle: req.t("erorMesages.403.pageTitle"),
                    status: res.statusCode,
                    text: req.t("erorMesages.403.text"),
                },
            });
            // res.status(500).send('Internal Server Error');
        }
        ;
        // Check if the allowed roles include "any" or if the user's role is allowed
        if (allowedRoles.includes('any') || allowedRoles.includes(userRole)) {
            // User has the required role or "any" role, proceed to the next middleware or route handler
            next();
        }
        else {
            return res.status(403).render("error", {
                title: req.t("labelpageTitles.LabelError"),
                name: req.t("labelpageTitles.LabelError"),
                breadcrumbs: [
                    { label: req.t("labelpageTitles.labelHome"), url: "/" },
                    { label: res.statusCode.toString(), url: null },
                ],
                messages: {
                    pageTitle: req.t("erorMesages.403.pageTitle"),
                    status: res.statusCode,
                    text: req.t("erorMesages.403.text"),
                },
            });
        }
    };
};
exports.default = aclMiddleware;
