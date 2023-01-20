import { Controller, Get } from '@nestjs/common';

import { InternalHttpResponse } from './core/http/internalHttpResponse';

@Controller()
export class AppController {
    @Get()
    async login(): Promise<InternalHttpResponse<undefined>> {
        return new InternalHttpResponse();
    }
}
