import { Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController{
    authProvider: AuthService;
    constructor(authProvider: AuthService)
    {
        this.authProvider = authProvider;
    }

    @Get()
    authHome()
    {
        return (this.authProvider.getAuth());
    }

    @Post('signup')
    signup()
    {
        return ('Signed up');
    }

    @Post('signin')
    signin()
    {
        return ('Signed IN!');
    }
}