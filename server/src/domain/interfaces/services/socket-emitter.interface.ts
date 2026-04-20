/**
 * ISocketEmitter — Domain interface for emitting socket events from
 * outside the gateway (Use Cases, Controllers) without depending on
 * the concrete Socket.io server instance.
 * 
 * Concrete implementation: infrastructure/providers/socket/socket-emitter.ts
 */
export interface ISocketEmitter {
  /**
   * Emit an event to a specific room (e.g., a userId room).
   */
  emitToRoom(room: string, event: string, data: unknown): void;

  /**
   * Force disconnect all sockets in a specific room.
   */
  disconnectRoom(room: string): void;
}
