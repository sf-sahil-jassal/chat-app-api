import {model, property} from '@loopback/repository';
import {CoreEntity} from '@sourceloop/core';

@model({settings: {strict: false}})
export class SocketMessage extends CoreEntity<SocketMessage> {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  subject?: string;

  @property({
    type: 'string',
    required: true,
  })
  body: string;

  @property({
    type: 'string',
  })
  toUserId?: string;

  @property({
    type: 'string',
    required: true,
  })
  channelId: string;

  @property({
    type: 'string',
    required: true,
  })
  channelType: string;

  @property({
    type: 'string',
  })
  createdBy?: string;

  constructor(data?: Partial<SocketMessage>) {
    super(data);
  }
}

export interface SocketMessageRelations {
  // describe navigational properties here
}

export type SocketMessageWithRelations = SocketMessage & SocketMessageRelations;
