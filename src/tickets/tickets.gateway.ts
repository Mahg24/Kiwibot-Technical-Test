import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ namespace: 'tickets' })
export class TicketsGateway {
  @WebSocketServer()
  server: Server;

  /**
   * This function emits a 'ticketStatusChange' event to the server with the provided ticket ID and
   * status.
   * @param {string} id - The id parameter is a string that represents the unique identifier of a
   * ticket.
   * @param {string} status - The `status` parameter is a string that represents the new status of a
   * ticket. It is used in the `ticketStatusChange` function to emit an event to the server with the
   * updated status and the ID of the ticket that was changed.
   */
  ticketStatusChange(id: string, status: string) {
    this.server.emit('ticketStatusChange', { id, status });
  }
}
