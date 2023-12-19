// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/example-socketio
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

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

  /**
   * The method is invoked when a client disconnects from the server
   * @param socket
   */
  @socketio.disconnect()
  disconnect() {
    debug('Client disconnected: %s', this.socket.id);
  }
}
