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
  handleConnection(client: Socket) {
    if (!client.handshake.headers.authorization) {
      client.disconnect();
    }
    this.wsClients[client.handshake.headers.authorization] = client;
  }

  askforHeartbeat(bot_id: string, ticket_id: string) {
    const client = this.wsClients[bot_id];
    if (client) {
      client.emit('hearbeat', { ticket_id });
    }
  }

  @SubscribeMessage('hearbeatAnswer')
  private hearbeatAnswer(@MessageBody() data) {
    this.botResponses$.next({
      ticket_id: data.ticket_id,
      heartbeat: data.heartbeat,
    });
  }

  getBotResponses$(): Subject<any> {
    return this.botResponses$;
  }
}
