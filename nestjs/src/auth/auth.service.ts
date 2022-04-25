import { ForbiddenException, ImATeapotException, Injectable } from '@nestjs/common';
import { AuthDto } from 'types/authDto';
import { LoginDto } from 'types/loginDto';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService, private axios: HttpService)
    {        
    }


    async intra(dto: { code: string })
    {
      // Setting variables according to parameters and environment variables
      const code = dto.code;
      const clientId = this.config.get('FORTYTWO_API_CLIENT_ID');
      const clientSecret = this.config.get('FORTYTWO_API_CLIENT_SECRET');
      console.log(`code: ${code}\nclientId:${clientId}\nclientSecret:${clientSecret}`);


      // Configuration object for POST request below.
      const requestConfig: any = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${code}`
        },
        params: {
          grant_type: 'authorization_code',
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
          redirect_uri: 'http://localhost:3001/login',
          state: 'secret',
        },
      };

      // POST request through axios.
      const responseData = await lastValueFrom(
        this.axios.post('https://api.intra.42.fr/oauth/token', null, requestConfig).pipe(
          map((response) => {
            return response.data;
          }),
        ),
      );

      // Logging data received from POST request
      console.log(`Received from 42 api: `);
      console.log(responseData);
      console.log(`Generated access_token from intra42: ${responseData.access_token}`);



      // Setting authorization header for GET request for 42 API
      const requestInfoConfig: any = {
          headers: {
            'Authorization': `Bearer ${responseData.access_token}`
          }
        };

      // GET request for 42 API
      const responseInfo = await lastValueFrom(
          this.axios.get('https://api.intra.42.fr/v2/me', requestInfoConfig).pipe(
            map((response) => {
              return response.data;
            }),
          ),
        );

      console.log(`Received after requested user info:`);
      console.log(responseInfo.email);


      // TRY to find user in database
      const user: any =  await this.prisma.user.findUnique({
        where: {
            email: responseInfo.email,
        },
      });


      // If doesn't exist, create him.
      if (!user)
      {
        try
        {
            // Save user in db
            const user = await this.prisma.user.create({
                data: {
                    email: responseInfo.email,
                    defaultPic: responseInfo.image_url,
                    nickname: responseInfo.login
                },
            })
        }
        catch(error)
        {
          console.log(error);
        }
      }

      // LOGGING user object
      console.log(user);


      // Generate the token and return it for now
      const token: { access_token: string } = await this.signToken(user.id, user.email);


      return {
        email: responseInfo.email,
        image: responseInfo.image_url,
        access_token: token.access_token,
      };

    }


    async signToken(userId: number, email: string):Promise<{ access_token: string }>
    {
        // Create a payload object, sub is standard for jwt, we'll use ID, and our own claim (email)
        const payload = {
            sub: userId,
            email
        }

        // Grab secret string from environment
        const secret: string = this.config.get('ACCESS_TOKEN_SECRET');

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

    async setNick(dto: any, email: string)
    {
      try
      {
        // TRY to find user in database
        const user: any =  await this.prisma.user.findUnique({
          where: {
              email: email,
          },
        });

        if (user.userReady === false)
        {
          const temp = await this.prisma.user.update({
            where:{
              email: email,
            },
            data: {
                  nickname: dto.nickname,
                  userReady: true,
            },
          });
          console.log('Logging Temp created');
          console.log(temp);
        }


      }
      catch(error)
      {
        throw error;
      }
    }

}
