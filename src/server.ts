import 'reflect-metadata';
import 'express-async-errors';
import Container from 'typedi';
import { App } from './app';
import { UserController } from './controllers/user.controller';
import { TransactionController } from './controllers/transaction.controller';
import { InformationController } from './controllers/information.controller';
import { HomeController } from './controllers/home.controller';
import { AppDataSource } from './shared/data/config/data-source';

console.log(process.env.TYPEORM_HOST);

const app = new App(Number(process.env.PORT) || 3000, [
  Container.get(UserController),
  Container.get(TransactionController),
  Container.get(InformationController),
  Container.get(HomeController),
]);

(async () => await AppDataSource.initialize())();

(() => {
  app.listen();
})();

process.on('SIGINT', () => {
  process.exit();
});
