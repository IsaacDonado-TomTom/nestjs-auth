import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
    private prisma: PrismaService;
    constructor(prisma: PrismaService){
        this.prisma = prisma;
    }

    async signup(dto: AuthDto)
    {
        // For logging purposes, delete this line
        console.log(dto);

        try
        {
            // Generate password hash
            const hash = await argon.hash(dto.hash);
            // Save user in Database
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash: hash
                },
            });
            // Return saved user
            return (user);
        }
        catch(error)
        {
            if (error instanceof PrismaClientKnownRequestError)
            {
                if (error.code === 'P2002')
                {
                    throw new ForbiddenException('Email is already in use!');
                }
            }
            throw error;
        }
    }

    async signin(dto: AuthDto)
    {
        // Try to find user
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        // Throw exception is user is not found
        if (!user)
        {
            throw new ForbiddenException('Email incorrect!');
        }

        // Check if passwords match
        const passwordMatch = await argon.verify(user.hash, dto.hash);

        // Throw error if passwords don't match
        if (!passwordMatch)
        {
            throw new ForbiddenException('Password incorrect!');
        }
        else
        {
            return user;
        }
    }
}
