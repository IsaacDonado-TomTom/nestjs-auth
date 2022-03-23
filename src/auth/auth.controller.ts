import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

// This means url/auth will be ported here
@Controller('auth')
export class AuthController {
    // Declaring private member of AuthService type
    private authService: AuthService;
    constructor (authService: AuthService)
    {
        // Setting the declared private property to whatever it's constructed with
        this.authService = authService;
    }

    // Routing url/auth/signup, grabbing the body and inserting it into a  AuthDto class.
    @Post('signup')
    signup(@Body() dto: AuthDto)
    {
        // Returning a function within our provider/service. Passing necessary stuff
        return (this.authService.signup(dto));
    }

    @Post('signin')
    signin(@Body() dto: AuthDto)
    {
        return (this.authService.signin(dto));
    }
}
