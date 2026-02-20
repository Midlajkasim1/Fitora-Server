export interface IGoogleTokenProvider {
  verifyIdToken(idToken: string): Promise<{
    email: string;
    firstName: string;
    lastName: string;
    googleId: string;
  }>;
}
    