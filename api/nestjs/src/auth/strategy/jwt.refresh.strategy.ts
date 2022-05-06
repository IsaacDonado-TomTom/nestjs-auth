import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { Request } from "express";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(config: ConfigService)
    {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('REFRESH_TOKEN_SECRET'),
            passReqToCallback: true,
        })
    }

    validate(req: Request, payload: any)
    {
        const refreshToken: string = req.get('authorization').replace('Bearer', '').trim();
        return ({
            ...payload,
            refreshToken
        });
    }
}