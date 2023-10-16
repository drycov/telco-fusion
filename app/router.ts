import { Request, Response, NextFunction, Express } from "express";
import sessionMiddleware from "./middlewares/sessionMiddleware";

export default function (app: Express) {

  app.get("/",sessionMiddleware, (req, res) => {
    res.redirect('/index');
  });

  app.route("/index").get(sessionMiddleware, (req, res) => {
    res.render("pages/index", {
      title: req.t("labelpageTitles.labelHome"),
      name: req.t("labelpageTitles.labelHome"),
      breadcrumbs: [{ label: req.t("labelpageTitles.labelHome"), url: "/" }],
    });
    // res.send('Hello, '+ req.user.username + '! Your role: ' + req.user.role + ' : \n'+JSON.stringify(req.user));
  });
  app.route('/login')
        .get(sessionMiddleware, (req, res) => {
            res.render('pages/login', { title: req.t('labelpageTitles.labelLogin') });
        })

  app.route("*").get(sessionMiddleware, (req, res) => {
    res.status(404).render("error", {
      title: req.t("labelpageTitles.LabelError"),
      name: req.t("labelpageTitles.LabelError"),
      breadcrumbs: [
        { label: req.t("labelpageTitles.labelHome"), url: "/" },
        { label: res.statusCode, url: null },
      ],
      messages: {
        pageTitle: req.t("erorMesages.404.pageTitle"),
        status: res.statusCode,
        text: req.t("erorMesages.404.text"),
      },
    });
  });
}
