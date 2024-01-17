import {inject} from '@loopback/core';
import {CountSchema, Filter, Where} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {STRATEGY, authenticate} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {SocketMessageRecipient, SocketNotification} from '../models';
import {SocketMessage} from '../models/socket-message.model';
import permissionKey from '../permission-key.enum';
import {MessageService, NotificationService} from '../services';

export class SocketMessageController {
  constructor(
    @inject('services.MessageService')
    private readonly messageService: MessageService,
    @inject('services.NotificationService')
    private readonly notificationService: NotificationService,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [permissionKey.ViewMessage]})
  @get('/messages', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Message model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(SocketMessage, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.header.string('Authorization') token: string,
    @param.query.string('ChannelID') channelID?: string,
    @param.filter(SocketMessage) filter?: Filter<SocketMessage>,
  ): Promise<SocketMessage[]> {
    const filter1: Filter<SocketMessage> = {
      where: {
        channelId: channelID,
      },
      order: ['createdOn ASC'],
    };
    return this.messageService.getMessage(token, filter1);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [permissionKey.CreateMessage]})
  @post('/messages', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Message model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(SocketMessage)},
        },
      },
    },
  })
  async create(
    @param.header.string('Authorization') token: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(SocketMessage, {
            title: 'Message',
            exclude: ['id'],
          }),
        },
      },
    })
    message: SocketMessage,
  ): Promise<SocketMessage> {
    message.channelId = message.channelId ?? message.toUserId;
    const msg = await this.messageService.createMessage(message, token);
    const msgrecipient = new SocketMessageRecipient({
      channelId: message.channelId,
      recipientId: message.toUserId ?? message.channelId,
      messageId: msg.id,
    });
    await this.messageService.createMessageRecipients(msgrecipient, token);
    const notif = new SocketNotification({
      subject: message.subject,
      body: message.body,
      type: 0,
      receiver: {
        to: [
          {
            type: 0,
            id: message.channelId,
          },
        ],
      },
    });
    await this.notificationService.createNotification(notif, token);

    return msg;
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [permissionKey.UpdateMessageRecipient]})
  @patch(`messages/{messageid}/markAsRead`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Message PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async patchMessageRecipients(
    @param.header.string('Authorization') token: string,
    @param.path.string('messageid') msgId: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(SocketMessageRecipient, {partial: true}),
        },
      },
    })
    messageRecipient: Partial<SocketMessageRecipient>, //NOSONAR
    @param.query.object('where', getWhereSchemaFor(SocketMessageRecipient))
    where?: Where<SocketMessageRecipient>, //NOSONAR
  ): Promise<SocketMessageRecipient> {
    const patched = {
      isRead: true,
    };

    return this.messageService.updateMsgRecipients(msgId, patched, token);
  }
}
