import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Subject } from 'rxjs';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class RobotsGateway implements OnGatewayConnection {
  private botResponses$ = new Subject<any>();
  @WebSocketServer() private server: Server;
  wsClients = {};

  /**
   * The function checks for authorization headers in a WebSocket connection and stores the client in
   * an object if authorized.
   * @param {Socket} client - Socket object representing the client connection to the WebSocket server.
   */
  handleConnection(client: Socket) {
    if (!client.handshake.headers.authorization) {
      client.disconnect();
    }
    this.wsClients[client.handshake.headers.authorization] = client;
  }

  /**
   * This function sends a heartbeat signal to a WebSocket client with a specific bot ID and ticket ID.
   * @param {string} bot_id - The bot_id parameter is a string that represents the unique identifier of
   * the bot that the heartbeat message is being sent to.
   * @param {string} ticket_id - The ticket_id parameter is a string that represents the unique
   * identifier of a ticket. It is used as a payload to emit a 'heartbeat' event to the WebSocket
   * client associated with the specified bot_id.
   */
  askforHeartbeat(bot_id: string, ticket_id: string) {
    const client = this.wsClients[bot_id];
    if (client) {
      client.emit('hearbeat', { ticket_id });
    }
  }

  /* This is a decorator that subscribes to a WebSocket message with the name 'hearbeatAnswer'. When a
message with this name is received, the function 'hearbeatAnswer' is called with the message body
data as a parameter. The function then emits the received data as an object with the 'ticket_id' and
'heartbeat' properties to the 'botResponses$' Subject. This allows other parts of the application to
subscribe to the 'botResponses$' Subject and receive the emitted data. */
  @SubscribeMessage('hearbeatAnswer')
  private hearbeatAnswer(@MessageBody() data) {
    this.botResponses$.next({
      ticket_id: data.ticket_id,
      heartbeat: data.heartbeat,
    });
  }

  /**
   * This function returns a Subject that emits bot responses.
   * @returns A Subject of type any named `botResponses$` is being returned.
   */
  getBotResponses$(): Subject<any> {
    return this.botResponses$;
  }
}
