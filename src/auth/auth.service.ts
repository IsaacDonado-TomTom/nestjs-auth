import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from 'types/authDto';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService)
    {
        
    }

    async signin(dto: AuthDto)
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
