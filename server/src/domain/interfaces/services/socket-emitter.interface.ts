
export interface ISocketEmitter {
 
  emitToRoom(room: string, event: string, data: unknown): void;


  disconnectRoom(room: string): void;
}
