export interface IMediaServerProvider {
  
    generateToken(params: {
        roomId: string;
        participantId: string;
        participantName: string;
        isTrainer: boolean;
    }): Promise<string>;

    closeSession(params: { roomId: string }): Promise<void>;
}
