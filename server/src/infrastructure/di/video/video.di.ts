import { GenerateCallTokenUseCase } from "@/application/usecases/video/generate-call-token.usecase";
import { StartSessionUseCase } from "@/application/usecases/video/start-session.usecase";
import { EndSessionUseCase } from "@/application/usecases/video/end-session.usecase";
import { GetSessionAccessStateUseCase } from "@/application/usecases/video/get-session-access-state.usecase";
import { HandleParticipantJoinedUseCase } from "@/application/usecases/video/handle-participant-joined.usecase";
import { HandleParticipantLeftUseCase } from "@/application/usecases/video/handle-participant-left.usecase";
import { ExecuteSessionPayoutUseCase } from "@/application/usecases/video/execute-session-payout.usecase";
import { LiveKitMediaServer } from "@/infrastructure/providers/media/livekit.service";
import { userRepositories } from "../user/user.repositories";
import { socketEmitterProxy } from "@/infrastructure/providers/socket/socket-emitter";
import { VideoCallController } from "@/presentation/controllers/user/video-call.controller";
import { LiveKitWebhookController } from "@/presentation/controllers/video/livekit-webhook.controller";
// ── Providers ────────────────────────────────────────────────────────────────
const mediaServerProvider = new LiveKitMediaServer();

const executeSessionPayoutUseCase = new ExecuteSessionPayoutUseCase(
    userRepositories.slotRepository,
    userRepositories.bookingRepository,
    userRepositories.subscriptionRepository,
    userRepositories.subscriptionPlanRepository,
    userRepositories.trainerRepository,
    userRepositories.transactionRepository,
    userRepositories.userRepository
);

// ── Use Cases ─────────────────────────────────────────────────────────────────
const generateCallTokenUseCase = new GenerateCallTokenUseCase(
    userRepositories.slotRepository,
    userRepositories.userRepository,
    mediaServerProvider
);

const startSessionUseCase = new StartSessionUseCase(
    userRepositories.slotRepository,
    socketEmitterProxy
);

const handleParticipantJoinedUseCase = new HandleParticipantJoinedUseCase(userRepositories.bookingRepository);
const handleParticipantLeftUseCase = new HandleParticipantLeftUseCase(userRepositories.bookingRepository);

const endSessionUseCase = new EndSessionUseCase(
    userRepositories.slotRepository,
    userRepositories.bookingRepository,
    socketEmitterProxy,
    handleParticipantLeftUseCase,
    executeSessionPayoutUseCase
);

const getSessionAccessStateUseCase = new GetSessionAccessStateUseCase(
    userRepositories.slotRepository,
    userRepositories.bookingRepository
);

// ── Controllers ───────────────────────────────────────────────────────────────
const videoCallController = new VideoCallController(
    generateCallTokenUseCase,
    endSessionUseCase,
    startSessionUseCase,
    getSessionAccessStateUseCase
);

const livekitWebhookController = new LiveKitWebhookController(
    handleParticipantJoinedUseCase,
    handleParticipantLeftUseCase
);

// ── Exports ───────────────────────────────────────────────────────────────────
export const videoUseCases = {
    generateCallTokenUseCase,
    startSessionUseCase,
    endSessionUseCase,
    getSessionAccessStateUseCase,
    handleParticipantJoinedUseCase,
    handleParticipantLeftUseCase
};

export const videoControllers = {
    videoCallController,
    livekitWebhookController
};

