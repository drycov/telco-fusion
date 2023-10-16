import { Request, Response, NextFunction } from 'express';

interface RenderCallback {
  (err: Error, html: string): void;
}

interface RenderFunction {
  (view: string, options?: object, callback?: RenderCallback): void;
}

function removeCommentsMiddleware(req: Request, res: Response, next: NextFunction) {
  const originalRender = res.render as RenderFunction;

  res.render = function(view: string, options?: object, callback?: RenderCallback) {
    const newCallback: RenderCallback = (err: Error, html: string) => {
      if (callback) {
        // Удалить комментарии из HTML перед вызовом callback
        callback(err, removeComments(html));
      } else {
        // Удалить комментарии из HTML и отправить клиенту
        res.send(removeComments(html));
      }
    };

    originalRender.call(res, view, options, newCallback);
  };

  next();
}

function removeComments(html: string): string {
  return html.replace(/<!--[\s\S]*?-->/g, '');
}

export default removeCommentsMiddleware;
