import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { IJWTServiceVerifyPayloadResult } from '../auth/auth.types';

export const UseUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): IJWTServiceVerifyPayloadResult => {
    const request = ctx.switchToHttp().getRequest();

    return request.userJwtPayload;
});
