import express, { Router } from 'express';

export abstract class BaseController {
  public abstract path: string;
  public router: Router;

  constructor() {
    this.router = express.Router();
  }

  protected abstract initializeRouter(): void;
}
