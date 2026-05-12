import { Server } from "socket.io";
import { ISocketEmitter } from "@/domain/interfaces/services/socket-emitter.interface";
import { logger } from "@/infrastructure/providers/loggers/logger";

let emitterInstance: SocketEmitter | null = null;

export class SocketEmitter implements ISocketEmitter {
  private readonly _io: Server;

  constructor(io: Server) {
    this._io = io;
  }

  emitToRoom(room: string, event: string, data: unknown): void {
    this._io.to(room).emit(event, data);
  }

  disconnectRoom(room: string): void {
    this._io.in(room).disconnectSockets(true);
  }
}

/**
 * Initialize the singleton SocketEmitter.
 * Call this in index.ts AFTER creating the Socket.io server.
 */
export const initSocketEmitter = (io: Server): SocketEmitter => {
  if (!emitterInstance) {
    emitterInstance = new SocketEmitter(io);
    logger.info("[SocketEmitter] Initialized with IO instance");
  }
  return emitterInstance;
};

/**
 * Proxy object that lazily resolves to the initialized emitter.
 * Import this wherever you need to emit events from non-socket contexts.
 */
export const socketEmitterProxy: ISocketEmitter = {
  emitToRoom(room: string, event: string, data: unknown): void {
    if (!emitterInstance) {
      logger.warn("[SocketEmitter] emitToRoom called before initialization — skipping");
      return;
    }
    emitterInstance.emitToRoom(room, event, data);
  },

  disconnectRoom(room: string): void {
    if (!emitterInstance) {
      logger.warn("[SocketEmitter] disconnectRoom called before initialization — skipping");
      return;
    }
    emitterInstance.disconnectRoom(room);
  },
};
