import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from 'types/authDto';
import { LoginDto } from 'types/loginDto';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {

    private googleAuthClient: any;
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService)
    {        
        this.googleAuthClient = new OAuth2Client(this.config.get('APP_GOOGLE_CLIENT_ID'));
    }

    async signin(dto: LoginDto)
    {
        // Try to find by email with prisma.user.findUnique
        const user: any = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        // Returns null if user is not found

        // Check if user is found
        if (!user)
        {
            throw new ForbiddenException('Invalid email');
        }
        else
        {
            // Compare passwords through hash using argon.verify, it accepts the hash and password
            const hashVerify: any =  await argon.verify(user.hash, dto.password);
            // Returns null if comparing failed

            //Checks if comparison failed
            if (!hashVerify)
            {
                throw new ForbiddenException('Invalid password');
            }
            else
            {
                // Generate token and return it for now
                const token: { access_token: string } = await this.signToken(user.id, user.email);
                return (token);
            }
        }
    }

    async google(dto: { token: string })
    {
        const token = dto.token;
        const ticket = await this.googleAuthClient.verifyIdToken({
            idToken: token,
            audience: this.config.get('APP_GOOGLE_CLIENT_ID')
        });
        const { name, email } = ticket.getPayload();

        //if (!name || !email)
        //{
        //    throw new ForbiddenException('Something went wrong yo.');
        //}

        // Try to find by email with prisma.user.findUnique
        const user: any = await this.prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user)
        {
            // Save user in db
            const user = await this.prisma.user.create({
                data: {
                    email: email,
                    hash: 'whatever',
                    nickname: name,
                },
            })
        }

        const response: { access_token } = await this.signToken(user.id, user.email); 

        return (response);
    }

    async signup(dto: AuthDto)
    {
        // Hash password
        const hash = await argon.hash(dto.password);

        try
        {
            // Save user in db
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash: hash,
                    nickname: dto.nickname,
                },
            })

            // Generate the token and return it for now
            const token: { access_token: string } = await this.signToken(user.id, user.email);
            return (token);
        }
        catch(error)
        {
            if (error instanceof PrismaClientKnownRequestError)
            {
                if (error.code === 'P2002')
                    throw new ForbiddenException('Email taken');
            }
            else
            {
                throw error;
            }
        }
    }

    async signToken(userId: number, email: string):Promise<{ access_token: string }>
    {
        // Create a payload object, sub is standard for jwt, we'll use ID, and our own claim (email)
        const payload = {
            sub: userId,
            email
        }

        // Grab secret string from environment
        const secret: string = this.config.get('SECRET');

        // Generate token using our payload object through jwt.signAsync
        // Function accepts the payload object and an object with the required secret key, and the expiration time of the token
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: secret,
        });

        // Return as an object that contains an access_token string.
        return ({
            access_token: token
        });
    }

}
