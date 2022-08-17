import { NextFunction, Request, Response } from 'express';
import { Service } from 'typedi';
import { BaseController } from './base';

@Service()
export class HomeController extends BaseController {
  public path = '/';

  constructor() {
    super();

    this.initializeRouter();
  }

  /**
   * @api {get} https://ae-bootcamp-be.herokuapp.com/ Get Open AE Bootcamp Welcome Page
   * @apiName Home
   * @apiGroup Home
   * @apiVersion 1.0.0
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   */
  home = (req: Request, res: Response, next: NextFunction) => {
    res.render('pages/home');
    next();
  };

  protected initializeRouter(): void {
    this.router.get('/', this.home);
  }
}
