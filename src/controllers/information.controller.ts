import { NextFunction, Request, Response } from 'express';
import { query } from 'express-validator';
import { Service } from 'typedi';
import url from 'url';
import {
  InformationBalanceService,
  InformationForecastService,
  InformationSeriesService,
  InformationSummaryService,
} from '../application';
import { authorize } from '../middlewares/authorize.middleware';
import { validateRequest } from '../middlewares/validation-request.middleware';
import { ForecastInputDto, SeriesInputDto, SummaryInputDto } from '../model';
import { BaseController } from './base';

@Service()
export class InformationController extends BaseController {
  public path = '/information';

  constructor(
    protected readonly informationBalanceService: InformationBalanceService,
    protected readonly informationSummaryService: InformationSummaryService,
    protected readonly informationSeriesService: InformationSeriesService,
    protected readonly informationForecastService: InformationForecastService,
  ) {
    super();

    this.initializeRouter();
  }

  /**
   * @api {get} https://ae-bootcamp-be.herokuapp.com/information/balance?currency=:currency Get the user balance
   * @apiName Balance
   * @apiGroup Information
   * @apiVersion 0.0.0
   *
   * @apiParam {String} currency The currency conversion, for example USD, AUD
   *
   * @apiSuccessExample {json} Success-Response:
   * HTTP/1.1 200 OK
   * {
   *       "balance": 500
   * }
   */
  balance = async (req: Request, res: Response, next: NextFunction) => {
    const query = url.parse(req.url, true).query;
    const balance = await this.informationBalanceService.getBalance(
      req.currentUser!.uuid,
      query.currency!.toString().toUpperCase(),
    );

    res.status(200).send({
      balance,
    });

    next();
  };

  /**
   * @api {get} https://ae-bootcamp-be.herokuapp.com/information/summary?currency=:currency&start_date=:startDate&end_date=:endDate Get Summary
   * @apiName Summary
   * @apiGroup Information
   * @apiVersion 0.0.0
   *
   * @apiParam {String} currency Currency conversion
   * @apiParam {String} startDate Start date range for summary
   * @apiParam {String} endDate End date range for summary
   *
   * @apiSuccessExample {json} Success-Response:
   * HTTP/1.1 200 OK
   * {
   *       "payments_received": 0,
   *       "payments_made": 0,
   *       "withdrawn": 500,
   *       "filled": 1000
   *  }
   */
  summary = async (req: Request, res: Response, next: NextFunction) => {
    const query = url.parse(req.url, true).query;
    const { start_date, end_date, currency } = query;

    const summaryInput: SummaryInputDto = {
      startDate: new Date(start_date!.toString()),
      endDate: new Date(end_date!.toString()),
      currency: currency!.toString().toUpperCase(),
    };

    const summary = await this.informationSummaryService.summary(
      req.currentUser!.uuid,
      summaryInput,
    );

    res.status(200).send(summary);

    next();
  };

  /**
   * @api {get} https://ae-bootcamp-be.herokuapp.com/information/series?currency=:currency&start_date=:startDate&end_date=:endDate Get Series
   * @apiName Series
   * @apiGroup Information
   * @apiVersion 0.0.0
   *
   * @apiParam {String} currency Currency conversion
   * @apiParam {String} startDate Start date range for summary
   * @apiParam {String} endDate End date range for summary
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * HTTP/1.1 200 OK
   * {
   *       "payments_received": [
   *           0
   *       ],
   *       "payments_made": [
   *           0
   *       ],
   *       "withdrawn": [
   *           500
   *       ],
   *       "filled": [
   *           1000
   *       ],
   *       "dates": [
   *           "2021-10-12"
   *       ]
   *   }
   */
  series = async (req: Request, res: Response, next: NextFunction) => {
    const query = url.parse(req.url, true).query;
    const { start_date, end_date, currency } = query;

    const seriesInput: SeriesInputDto = {
      startDate: new Date(start_date!.toString()),
      endDate: new Date(end_date!.toString()),
      currency: currency!.toString().toUpperCase(),
    };

    const series = await this.informationSeriesService.series(req.currentUser!.uuid, seriesInput);

    res.status(200).send(series);

    next();
  };

  /**
   * @api {get} https://ae-bootcamp-be.herokuapp.com/information/forecast?currency=:currency&days=:days&type=:type Get Forecast
   * @apiName Forecast
   * @apiGroup Information
   * @apiVersion 0.0.0
   *
   * @apiParam {String} currency Currency conversion
   * @apiParam {Number} days Number of days for forecasting (3 would be 3 days back for example)
   * @apiParam {String} type End date range for summary [payment_received, payment_made, payment_withdraw, payment_fill]
   *
   * @apiSuccessExample {json} Success-Response:
   * HTTP/1.1 200 OK
   * {
   *       "dates": [
   *           "2021-10-12"
   *       ],
   *       "payment_fill": [
   *           1000
   *       ]
   * }
   */
  forecast = async (req: Request, res: Response, next: NextFunction) => {
    const query = url.parse(req.url, true).query;
    const forecastInput: ForecastInputDto = query as any;

    const forecast = await this.informationForecastService.forecast(
      req.currentUser!.uuid,
      forecastInput,
    );

    res.status(200).send(forecast);

    next();
  };

  protected initializeRouter(): void {
    this.router.get(
      `${this.path}/balance`,
      query('currency').exists().notEmpty(),
      authorize,
      validateRequest,
      this.balance,
    );

    this.router.get(
      `${this.path}/summary`,
      query('currency').exists().notEmpty(),
      query('start_date').exists().isDate(),
      query('end_date').exists().isDate(),
      authorize,
      validateRequest,
      this.summary,
    );

    this.router.get(
      `${this.path}/series`,
      query('currency').exists().notEmpty(),
      query('start_date').exists().isDate(),
      query('end_date').exists().isDate(),
      authorize,
      validateRequest,
      this.series,
    );

    this.router.get(
      `${this.path}/forecast`,
      query('currency').exists().notEmpty(),
      query('days').exists().notEmpty(),
      query('type')
        .exists()
        .notEmpty()
        .custom((value) => {
          const allowedValues = [
            'payment_fill',
            'payment_withdraw',
            'payment_made',
            'payment_received',
          ];

          if (allowedValues.indexOf(value) === -1) {
            Promise.reject(
              'type is invalid. It can be: payment_fill, payment_withdraw, payment_made, payment_received ',
            );
          }

          return true;
        }),
      authorize,
      validateRequest,
      this.forecast,
    );
  }
}
