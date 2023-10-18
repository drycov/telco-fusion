import express from 'express';
// Генератор идентификатора сессии
const generateSessionID = (req: express.Request) => {
    const { username } = req.session as unknown as { username: string };
    const timestamp = Date.now();
    return `${username}-${timestamp}`;
  };

  export default generateSessionID;