// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/example-socketio
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import dotenv from 'dotenv';
import {ApplicationConfig, SocketIoExampleApplication} from './application';
import {SocketIoController} from './controllers';

export * from './application';

dotenv.config();
export async function main(options: ApplicationConfig = {}) {
  const app = new SocketIoExampleApplication(options);
  app.controller(SocketIoController);
  await app.start();

  const url = app.socketServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}

if (require.main === module) {
  // Run the application
  const config = {
    httpServerOptions: {
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST,
      // The `gracePeriodForClose` provides a graceful close for http/https
      // servers with keep-alive clients. The default value is `Infinity`
      // (don't force-close). If you want to immediately destroy all sockets
      // upon stop, set its value to `0`.
      // See https://www.npmjs.com/package/stoppable
      gracePeriodForClose: 5000, // 5 seconds
    },
    socketIoOptions: {
      cors: {
        origin: process.env.ALLOWED_ORIGIN,
      },
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
