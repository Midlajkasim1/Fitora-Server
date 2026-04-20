import { GenerateCallTokenUseCase } from "@/application/usecases/video/generate-call-token.usecase";
import { EndCallUseCase } from "@/application/usecases/video/end-call.usecase";
import { StartSessionUseCase } from "@/application/usecases/video/start-session.usecase";
import { LiveKitMediaServer } from "@/infrastructure/providers/media/livekit.service";
import { userRepositories } from "../user/user.repositories";
import { socketEmitterProxy } from "@/infrastructure/providers/socket/socket-emitter";
import { VideoCallController } from "@/presentation/controllers/user/video-call.controller";

// ── Providers ────────────────────────────────────────────────────────────────
const mediaServerProvider = new LiveKitMediaServer();

// ── Use Cases ─────────────────────────────────────────────────────────────────
const generateCallTokenUseCase = new GenerateCallTokenUseCase(
    userRepositories.slotRepository,
    userRepositories.userRepository,
    mediaServerProvider
);

const endCallUseCase = new EndCallUseCase(
    userRepositories.slotRepository,
    socketEmitterProxy,
    mediaServerProvider
);

const startSessionUseCase = new StartSessionUseCase(
    userRepositories.slotRepository,
    socketEmitterProxy
);

// ── Controller ────────────────────────────────────────────────────────────────
const videoCallController = new VideoCallController(
    generateCallTokenUseCase,
    endCallUseCase,
    startSessionUseCase
);

// ── Exports ───────────────────────────────────────────────────────────────────
export const videoUseCases = {
    generateCallTokenUseCase,
    endCallUseCase,
};

export const videoControllers = {
    videoCallController,
};
