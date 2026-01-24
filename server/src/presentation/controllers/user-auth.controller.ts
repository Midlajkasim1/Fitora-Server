import { Request, Response } from "express";
import { RegisterUseCase } from "@/application/usecases/auth/register.usecase";
import { VerifyOtpUseCase } from "@/application/usecases/auth/verify-otp.usecase";
import { LoginUseCase } from "@/application/usecases/auth/login.usecase";
import { GoogleAuthUseCase } from "@/application/usecases/auth/google-auth.usecase";
import { ResendOtpUseCase } from "@/application/usecases/auth/ResendOtp.usecase";
import { ResendOtpDTO } from "@/application/dto/auth/resend-otp.dto";

export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly verifyOtpUseCase: VerifyOtpUseCase,
    private readonly resendOtpUseCase: ResendOtpUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly googleAuthUseCase: GoogleAuthUseCase,
  ) { }


  async register(req: Request, res: Response): Promise<Response> {
    try {
      const result = await this.registerUseCase.execute(req.body);

      return res.status(200).json({
        success: true,
        message: "OTP sent successfully",
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Registration failed",
      });
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<Response> {
    try {
      const { email, otp } = req.body;

      const result = await this.verifyOtpUseCase.execute(email, otp);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "OTP verification failed",
      });
    }
  }
  async resendOtp(req: Request, res: Response): Promise<Response> {
  try {
    const { email } = req.body as ResendOtpDTO;

    const result = await this.resendOtpUseCase.execute(email);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


async login(req: Request, res: Response): Promise<Response> {
  try {
    const result = await this.loginUseCase.execute(req.body);
    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        role: result.role
      }
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
}


async googleLogin(req: Request, res: Response) {
  try {
    const { idToken, role } = req.body;
    const result = await this.googleAuthUseCase.execute(idToken, role);

    // SET THE COOKIE ON THE BACKEND
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,    // Protects from XSS
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000 // 15 mins
    });

    return res.status(200).json({
      success: true,
      data: {
        role: result.role,
        isOnboardingRequired: result.isOnboardingRequired //
      },
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

// next forgot passoword

}
