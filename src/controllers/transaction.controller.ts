import { NextFunction, Request, Response } from 'express';
import { Service } from 'typedi';
import { body, header } from 'express-validator';

import { BaseController } from './base';
import { authorize } from '../middlewares/authorize.middleware';
import { validateRequest } from '../middlewares/validation-request.middleware';
import {
  TransactionFillService,
  TransactionWithdrawService,
  TransactionPayService,
} from '../application';

@Service()
export class TransactionController extends BaseController {
  public path = '/transactions';

  constructor(
    protected readonly transactionFillService: TransactionFillService,
    protected readonly transactionWithdrawService: TransactionWithdrawService,
    protected readonly transactionPayService: TransactionPayService,
  ) {
    super();

    this.initializeRouter();
  }

  /**
   * @api {post} https://ae-bootcamp-be.herokuapp.com/transaction/fill Post Fill
   * @apiName Fill
   * @apiGroup Transaction
   * @apiVersion 0.0.0
   *
   * @apiParam {Number} value Amount of money to fill in the wallet
   *
   * @apiSuccessExample {json} Success-Response:
   * HTTP/1.1 201 OK
   */
  fill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { value } = req.body;

    await this.transactionFillService.fill(value, req.currentUser!.uuid);

    res.status(201).send();

    next();
  };

  /**
   * @api {post} https://ae-bootcamp-be.herokuapp.com/transaction/withdraw Post Withdraw
   * @apiName Withdraw
   * @apiGroup Transaction
   * @apiVersion 0.0.0
   *
   * @apiParam {Number} value Amount of money to fill in the wallet
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   */
  withdraw = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { value } = req.body;

    await this.transactionWithdrawService.withdraw(value, req.currentUser!.uuid);

    res.status(200).send();

    next();
  };

  /**
   * @api {post} https://ae-bootcamp-be.herokuapp.com/transaction/pay Post Pay
   * @apiName Pay
   * @apiGroup Transaction
   * @apiVersion 0.0.0
   *
   * @apiParam {String} value Amount of money to pay someone else
   * @apiParam {String} email Email of the user to be paid
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   */
  pay = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { value, email } = req.body;

    await this.transactionPayService.pay(value, req.currentUser!.uuid, email);

    res.status(200).send();

    next();
  };

  /**
   * @api {get} https://ae-bootcamp-be.herokuapp.com/transaction Get
   * @apiName Get
   * @apiGroup Transaction
   * @apiVersion 0.0.0
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   */
  get = (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send();

    next();
  };

  protected initializeRouter(): void {
    this.router.post(
      `${this.path}/fill`,
      body('value').exists().isNumeric(),
      header('authorization').exists(),
      authorize,
      validateRequest,
      this.fill,
    );

    this.router.post(
      `${this.path}/withdraw`,
      body('value').exists().isNumeric(),
      header('authorization').exists(),
      authorize,
      validateRequest,
      this.withdraw,
    );

    this.router.post(
      `${this.path}/pay`,
      body('value')
        .exists()
        .isNumeric()
        .custom((value) => {
          if (value <= 0) {
            return Promise.reject('Payment should be greater than 0');
          }

          return true;
        }),
      body('email').exists().isEmail(),
      header('authorization').exists(),
      authorize,
      validateRequest,
      this.pay,
    );

    this.router.get(`${this.path}`, authorize, validateRequest, this.get);
  }
}
