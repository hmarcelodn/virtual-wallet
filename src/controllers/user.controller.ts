import { Request, Response, NextFunction } from 'express';
import { Service } from 'typedi';
import { body, header } from 'express-validator';

import { BaseController } from './base';
import { UserLoginService, UserSignupService, UserLogoutService } from '../application';
import { validateRequest } from '../middlewares/validation-request.middleware';

@Service()
export class UserController extends BaseController {
  public path = '/user';

  constructor(
    protected readonly userSignupService: UserSignupService,
    protected readonly userLoginService: UserLoginService,
    protected readonly userLogoutService: UserLogoutService,
  ) {
    super();

    this.initializeRouter();
  }

  /**
   * @api {post} https://ae-bootcamp-be.herokuapp.com/user/signup Get Signup
   * @apiName Signup
   * @apiGroup User
   * @apiVersion 0.0.0
   *
   * @apiParam {String} first_name User first name
   * @apiParam {String} last_name User last name.
   * @apiParam {String} id User personal ID.
   * @apiParam {String} birth_date User birth date.
   * @apiParam {String} email User email for signin.
   * @apiParam {String} password User password.
   *
   * @apiSuccessExample {json} Success-Response:
   * HTTP/1.1 200 OK
   * {
   *       "email": "hugo.delnegro2@agileengine.com",
   *       "birthDate": "1988-08-25T00:00:00.000Z",
   *       "firstName": "Hugo",
   *       "lastName": "Del Negro",
   *       "password": "U2FsdGVkX1+rWb12liYUUQG1HtotWw/ZyCt0WiPG8SY=",
   *       "userIdentity": "33996336",
   *       "id": 2
   * }
   */
  signup = async (req: Request, res: Response, next: NextFunction) => {
    const user = await this.userSignupService.signup(req.body);

    res.status(201).send(user);

    return next();
  };

  /**
   * @api {post} https://ae-bootcamp-be.herokuapp.com/user/signin Get Signin
   * @apiName Signin
   * @apiGroup User
   * @apiVersion 0.0.0
   *
   * @apiParam {String} email User email for signin.
   * @apiParam {String} password User password for signin.
   *
   * @apiSuccessExample {json} Success-Response:
   *  HTTP/1.1 200 OK
   *  {
   *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imh1Z28uZGVsbmVncm9AYWdpbGVlbmdpbmUuY29tIiwidXVpZCI6MSwiZmlyc3ROYW1lIjoiSHVnbyIsImxhc3ROYW1lIjoiRGVsIE5lZ3JvIiwiaWQiOiIzMzk5NjMzNiIsImlhdCI6MTYzNDMyMjg2NCwiZXhwIjoxNjM0MzIzNzY0fQ.YtoaDB4sprEtOxVRXKuA9d3clUWxTu928jD1PylUTr8"
   *  }
   */
  signin = async (req: Request, res: Response, next: NextFunction) => {
    const token = await this.userLoginService.login(req.body);

    res.status(200).send(token);

    return next();
  };

  /**
   * @api {post} https://ae-bootcamp-be.herokuapp.com/user/logout Get Logout
   * @apiName Logout
   * @apiGroup User
   * @apiVersion 0.0.0
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   */
  logout = async (req: Request, res: Response, next: NextFunction) => {
    await this.userLogoutService.logout(req.headers.authorization!);

    res.status(200).send();

    return next();
  };

  protected initializeRouter = (): void => {
    this.router.post(
      `${this.path}/signup`,
      body('first_name').notEmpty(),
      body('last_name').notEmpty(),
      body('id').notEmpty(),
      body('birth_date').notEmpty().isDate(),
      body('email').notEmpty().isEmail(),
      body('password').notEmpty(),
      validateRequest,
      this.signup,
    );

    this.router.post(
      `${this.path}/login`,
      body('email').notEmpty().isEmail(),
      body('password').notEmpty(),
      validateRequest,
      this.signin,
    );

    this.router.post(
      `${this.path}/logout`,
      header('Authorization').exists(),
      validateRequest,
      this.logout,
    );
  };
}
