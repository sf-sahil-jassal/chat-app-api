// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/example-socketio
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {ApplicationConfig} from '@loopback/core';
import {SocketIoApplication} from '@loopback/socketio';
import debugFactory from 'debug';
import {SocketIoController} from './controllers';

const debug = debugFactory('loopback:example:socketio:demo');

export {ApplicationConfig};

export class SocketIoExampleApplication extends SocketIoApplication {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.socketServer.use((socket, next) => {
      debug('Global middleware - socket:', socket.id);
      next();
    });

    const ns = this.socketServer.route(SocketIoController);
    ns.use((socket, next) => {
      debug(
        'Middleware for namespace %s - socket: %s',
        socket.nsp.name,
        socket.id,
      );
      next();
    });
  }
}
