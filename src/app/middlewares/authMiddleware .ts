import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../configs/web.config';
import getUserRole from '../utils/getUserRole';
import getUserData from '../utils/getUserData';
interface MyRequest extends Request {
    user?: any; // тип пользователя может быть адаптирован под ваши нужды
  }
const authMiddleware = (req: MyRequest, res: Response, next: NextFunction) => {
  // Проверка авторизации пользователя
  // Здесь вы можете реализовать логику проверки авторизации,
  // например, проверка наличия токена авторизации в куках запроса
  // или проверка наличия сессии пользователя

  // Если пользователь авторизован, вызываем next() для передачи управления следующему middleware или обработчику маршрута
  // Если пользователь не авторизован, можно отправить ошибку или выполнить перенаправление на страницу входа

  // Пример проверки наличия токена авторизации в куках
  const token = req.session!.token;

  if (!token || !req.session!.isAuthenticated) {
    return res.redirect('/login');
  }

  // Проверка действительности токена
  // Здесь можно использовать любую выбранную вами стратегию проверки токена, например, проверку в базе данных или использование сторонней библиотеки для проверки JWT
  try {
    const decoded = jwt.verify(token, process.env.sesionKey || config.sesionKey) as { username: string };
    req.user = decoded;
    const userdata = getUserData(decoded.username);
    req.user = {
      ...req.user,
      role: getUserRole(decoded.username),
      ...userdata,
      // другие свойства пользователя
    };  // Добавляем информацию о пользователе в объект запроса
    req.session!.user = req.user;
    next();
  } catch (err) {
    return res.redirect('/login');
  }
};

export default authMiddleware;
