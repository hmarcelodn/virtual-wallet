import { Service } from 'typedi';
import { Connection, createConnection } from 'typeorm';

@Service()
export class PostgresClient {
  protected _connection: Connection;

  get connection(): Connection {
    return this._connection;
  }

  connect = () => {
    return new Promise((resolve, reject) => {
      if (this._connection && this._connection.isConnected) {
        resolve(undefined);
      }

      createConnection()
        .then((connection: Connection) => {
          this._connection = connection;

          process.on('SIGINT', () => {
            this._connection.close();
          });

          process.on('SIGTERM', () => {
            this._connection.close();
          });

          resolve(undefined);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
}
