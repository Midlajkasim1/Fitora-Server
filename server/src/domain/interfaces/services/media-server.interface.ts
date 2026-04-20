export interface IMediaServerProvider {
    /**
     * Generates a token for joining a video session.
     * @param roomId The room ID (slotId) to join.
     * @param participantId Unique ID for the participant.
     * @param participantName Display name for the participant.
     * @param isTrainer Whether the participant is the trainer (host).
     */
    generateToken(roomId: string, participantId: string, participantName: string, isTrainer: boolean): Promise<string>;

    /**
     * Ends a session and kicks all participants.
     * @param roomId The room ID to close.
     */
    closeSession(roomId: string): Promise<void>;
}
