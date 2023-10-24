import { Express } from 'express';

import i18n from 'i18n';
import authController from './controllers/authController';
import getIndexPage from './controllers/indexController';
import { getUsers } from './controllers/usersController';
import aclMiddleware from './middlewares/aclMiddleware';
import authMiddleware from './middlewares/authMiddleware ';


export default function (app: Express) {
  app.get('/', (req, res) => {
    res.redirect('/index');
  });
  app.route('/index').get(authMiddleware, aclMiddleware(['any']), getIndexPage);
  app.route('/login').get(authController.getLogin).post(authController.postLogin);
  app.get('/setLanguage/:lng', (req, res) => {
    const { lng  } = req.params;
    req.session!.lang = lng;

    i18n.setLocale(req, lng); // Set the language in the request
    res.redirect('back'); // Redirect back to the previous page
  });

  app.get('/logout', (req, res) => {
    // Clear the session (assuming you're using express-session)
    req.session = null;

    // Clear the cookie
    res.clearCookie('token');
    res.clearCookie('session');
    res.clearCookie('session.sig');

    // Redirect or respond as needed
    res.redirect('/login');
  });

  app.route('/tu').get(getUsers)


  app.route('*').get((req, res) => {

    res.status(404).render('error', {
      error: true,
      title: req.__('labelpageTitles.LabelError'),
      name: req.__('labelpageTitles.LabelError'),
      breadcrumbs: [{ label: req.__('labelpageTitles.labelHome'), url: '/' }, { label: res.statusCode, url: null }],
      messages: {
        pageTitle: req.__('erorMesages.404.pageTitle'),
        status: res.statusCode,
        text: req.__('erorMesages.404.text'),
      },
    });
  });
}
