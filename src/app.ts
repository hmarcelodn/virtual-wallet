import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import path from 'path';
import { BaseController } from './controllers';
import { errorHandler } from './middlewares';

export class App {
  public app: Application;
  public port: number;

  constructor(port: number, controllers: Array<BaseController>) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.app.use(errorHandler);
  }

  listen = () => {
    this.app.listen(this.port, () => {
      console.log(`AgileEngine Bootcamp Wallet running at ${this.port}...`);
    });
  };

  protected initializeMiddlewares = (): void => {
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(cors());
    this.app.set('view engine', 'ejs');
    this.app.set('views', path.resolve(__dirname, 'views'));
    this.app.use(express.static('public'));
  };

  protected initializeControllers = (controllers: Array<BaseController>): void => {
    controllers.map((controller: BaseController) => {
      this.app.use('/', controller.router);
    });
  };
}
