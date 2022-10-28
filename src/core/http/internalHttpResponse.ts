import { HttpStatus } from '@nestjs/common';

interface IInternalHttpResponse<T> {
    status?: HttpStatus;
    data?: T;
}

export class InternalHttpResponse<T> {
    private readonly status: HttpStatus;
    private readonly data: T;

    constructor({ status, data }: IInternalHttpResponse<T>) {
        this.status = status || HttpStatus.OK;
        this.data = data;
    }
}
