import { Express } from 'express';
import cookieSession from 'cookie-session';

import jwt from 'jsonwebtoken';
import config from './configs/web.config';
import sessionMiddleware from './middlewares/sessionMiddleware';
import authMiddleware from './middlewares/authMiddleware ';
import aclMiddleware from './middlewares/aclMiddleware';


export default function (app: Express) {
  app.get('/', (req, res) => {
    res.redirect('/index');
  });

  app.route('/index').get(authMiddleware, aclMiddleware(['any']), (req, res) => {
    console.log(req.session)
    res.render('pages/index', {
      title: req.t('labelpageTitles.labelHome'),
      name: req.t('labelpageTitles.labelHome'),
      breadcrumbs: [{ label: req.t('labelpageTitles.labelHome'), url: '/' }],
    });
  });

  app.route('/login').get((req, res) => {
    res.render('pages/login', {
      title: req.t('labelpageTitles.labelLogin'),
    });
  }).post((req, res) => {
    const { username, password } = req.body;
    if ((username === 'admin' && password === 'admin') || (username === 'user' && password === 'password')) {
      const token = jwt.sign({ username }, process.env.sesionKey || config.sesionKey, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true });

      // Assign values to session properties
      req.session!.isAuthenticated = true;
      req.session!.token = token;
      req.session!.user = { username }; // Set your user object here

      console.log("postLOGIN: \n", res.locals.session)
      res.redirect('/index');
    } else {
      res.redirect('/login');
    }
  });

  app.get('/logout', (req, res) => {
    // Clear the session (assuming you're using express-session)
    req.session = null;

    // Clear the cookie
    res.clearCookie('token');

    // Redirect or respond as needed
    res.redirect('/login');
  });



  app.route('*').get((req, res) => {

    res.status(404).render('error', {

      title: req.t('labelpageTitles.LabelError'),
      name: req.t('labelpageTitles.LabelError'),
      breadcrumbs: [{ label: req.t('labelpageTitles.labelHome'), url: '/' }, { label: res.statusCode, url: null }],
      messages: {
        pageTitle: req.t('erorMesages.404.pageTitle'),
        status: res.statusCode,
        text: req.t('erorMesages.404.text'),
      },
    });
  });
}
