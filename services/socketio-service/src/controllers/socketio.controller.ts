// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/example-socketio
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {JSONObject} from '@loopback/core';
import {Socket, socketio} from '@loopback/socketio';
import debugFactory from 'debug';

const debug = debugFactory('loopback:socketio:controller');

/**
 * A demo controller for socket.io
 *
 * ```ts
 * @socketio('/')
 * ```
 * This specifies the namespace / for this controller
 * Regex or strings are acceptable values for namespace
 */
@socketio('/')
export class SocketIoController {
  constructor(
    @socketio.socket() // Equivalent to `@inject('ws.socket')`
    private socket: Socket,
  ) {}

  /**
   * The method is invoked when a client connects to the server
   *
   * @param socket - The socket object for client
   */
  @socketio.connect()
  connect(socket: Socket) {
    debug('Client connected: %s', this.socket.id);
  }

  /**
   * Register a handler for 'send-new-message' event
   *
   * @param payload - The message sent by client
   */
  @socketio.subscribe('send-new-message')
  handleSendNewChatMessage(payload: unknown) {
    this.socket.broadcast.emit('recieve-new-message', payload);
  }

  @socketio.subscribe('general-message')
  handleNotificationMessage(msg: string) {
    console.log('Hello notification message');
    return;
    const parsedMsg: {
      subject: string;
      body: string;
      receiver: {
        to: {
          id: string;
          name?: string;
        }[];
      };
      type: string;
      sentDate: Date;
      options?: JSONObject;
    } = JSON.parse(msg);

    if (parsedMsg?.receiver?.to?.length > 0) {
      parsedMsg.receiver.to.forEach(item =>
        this.socket.nsp.to(item.id).emit('userNotif', {
          subject: parsedMsg.subject,
          body: parsedMsg.body,
          options: parsedMsg.options,
        }),
      );
    } else {
      throw new Error('Inappropriate message data');
    }
  }

  /**
   * The method is invoked when a client disconnects from the server
   * @param socket
   */
  @socketio.disconnect()
  disconnect() {
    debug('Client disconnected: %s', this.socket.id);
  }
}
