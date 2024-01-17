import {model, property} from '@loopback/repository';
import {CoreEntity} from '@sourceloop/core';

@model({settings: {strict: false}})
export class SocketMessageRecipient extends CoreEntity<SocketMessageRecipient> {
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
  channelId: string;

  @property({
    type: 'string',
    required: true,
  })
  recipientId: string;

  @property({
    type: 'string',
    required: true,
  })
  messageId: string;

  @property({
    type: 'string',
    default: false,
  })
  isRead?: string;

  constructor(data?: Partial<SocketMessageRecipient>) {
    super(data);
  }
}

export interface SocketMessageRecipientRelations {
  // describe navigational properties here
}

export type SocketMessageRecipientWithRelations = SocketMessageRecipient &
  SocketMessageRecipientRelations;
