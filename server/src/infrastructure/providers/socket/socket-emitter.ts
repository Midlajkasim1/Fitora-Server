import { Emitter } from "@socket.io/redis-emitter";
import Redis from "ioredis";
import { env } from "@/infrastructure/config/env.config";
import { ISocketEmitter } from "@/domain/interfaces/services/socket-emitter.interface";
import { logger } from "@/infrastructure/providers/loggers/logger";

/**
 * SocketEmitter — Decoupled publisher that lets Use Cases / Controllers
 * fire socket events to any room WITHOUT importing the Socket.io server.
 * 
 * Uses a separate dedicated Redis pub/sub client (best practice: ioredis
 * connections should not be shared between pub/sub and regular commands).
 */

let emitterInstance: SocketEmitter | null = null;

export class SocketEmitter implements ISocketEmitter {
  private readonly _emitter: Emitter;

  constructor() {
    const pubClient = new Redis(env.REDIS_URL || "redis://127.0.0.1:6379");

    pubClient.on("connect", () => logger.info("[SocketEmitter] Redis pub client connected"));
    pubClient.on("error", (err) => logger.error("[SocketEmitter] Redis pub client error", err));

    this._emitter = new Emitter(pubClient);
  }

  emitToRoom(room: string, event: string, data: unknown): void {
    this._emitter.to(room).emit(event, data);
  }

  disconnectRoom(room: string): void {
    this._emitter.in(room).disconnectSockets(true);
  }
}

/**
 * Initialize the singleton SocketEmitter.
 * Call this in index.ts BEFORE creating the Socket.io server.
 */
export const initSocketEmitter = (): SocketEmitter => {
  if (!emitterInstance) {
    emitterInstance = new SocketEmitter();
    logger.info("[SocketEmitter] Initialized");
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
