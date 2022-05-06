import { ForbiddenException, ImATeapotException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';

import { tokenPairDto } from '../../types/tokenPairDto';

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService, private axios: HttpService)
    {        
    }


    async login(dto: { code: string })
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
      console.log('console.log(user): ');
      console.log(user);


      // Generate the tokens
      const tokens: tokenPairDto = await this.signTokens(user.id, user.email);
      // Update refresh token hash on database for user
      await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
      // Return tokens pair
      return tokens;
    }

    async logout(id: number)
    {
      await this.prisma.user.updateMany({
        where: {
          id: id,
          refreshTokenHash: {
            not: null,
          },
        },
        data: {
          refreshTokenHash: null,
        },
      });
    }

    async refreshTokens(id: number, refreshToken: string) : Promise<tokenPairDto>
    {
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
        }
      });
      if (!user)
      {
        throw new ForbiddenException("Access denied");
      }

      const hashVerify = await argon.verify(user.refreshTokenHash, refreshToken);
      if (!hashVerify)
      {
        throw new ForbiddenException("Access denied");
      }
      else 
      {
        const tokens: tokenPairDto = await this.signTokens(user.id, user.email);
        await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
        return tokens;
      }
    }

    async updateRefreshTokenHash(id: number, refreshToken: string)
    {
      const refreshTokenHash: string = await argon.hash(refreshToken);
      await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          refreshTokenHash: refreshTokenHash,
        }
      });
    }


    async signTokens(userId: number, email: string):Promise<tokenPairDto>
    {
        // Create a payload object, sub is standard for jwt, we'll use ID, and our own claim (email)
        const payload = {
            sub: userId,
            email
        }

        // Grab secret string from environment
        const accessTokenSecret: string = this.config.get('ACCESS_TOKEN_SECRET');
        const refreshTokenSecret: string = this.config.get('REFRESH_TOKEN_SECRET');

        // Generate token using our payload object through jwt.signAsync
        // Function accepts the payload object and an object with the required secret key, and the expiration time of the token
        const accessToken = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: accessTokenSecret,
        });

        const refreshToken = await this.jwt.signAsync(payload, {
          expiresIn: 60 * 60 * 24 * 7,
          secret: accessTokenSecret,
      });

        // Return as an object that contains an access_token string.
        return ({
            access_token: accessToken,
            refresh_token: refreshToken
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
          console.log('Attempting to update userReady to true');
          await this.prisma.user.update({
            where:{
              email: email,
            },
            data: {
                  nickname: dto.nickname,
                  userReady: true,
            },
          });
        }


      }
      catch(error)
      {
        throw error;
      }
    }

}
