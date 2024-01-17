import {model, property} from '@loopback/repository';
import {CoreEntity} from '@sourceloop/core';

@model({settings: {strict: false}})
export class SocketNotification extends CoreEntity<SocketNotification> {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  subject: string;

  @property({
    type: 'string',
    required: true,
  })
  body: string;

  @property({
    type: 'object',
    required: true,
  })
  receiver: object;

  @property({
    type: 'number',
    required: true,
  })
  type: number;

  constructor(data?: Partial<SocketNotification>) {
    super(data);
  }
}

export interface SocketNotificationRelations {
  // describe navigational properties here
}

export type SocketNotificationWithRelations = SocketNotification &
  SocketNotificationRelations;
