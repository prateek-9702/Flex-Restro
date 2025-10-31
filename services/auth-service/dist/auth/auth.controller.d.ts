import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: {
        email: string;
        password: string;
        role?: string;
    }): Promise<import("./user.entity").User>;
    login(req: any): Promise<{
        access_token: string;
        user: any;
    }>;
}
