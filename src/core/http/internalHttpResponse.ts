import { InternalHttpStatus } from './internalHttpStatus';

interface IInternalHttpResponse<T> {
    status?: InternalHttpStatus;
    data?: T;
}

export class InternalHttpResponse<T = undefined> {
    private readonly status: InternalHttpStatus;
    private readonly data: T;

    constructor(params?: IInternalHttpResponse<T> | undefined) {
        this.status = params?.status | InternalHttpStatus.OK;
        this.data = params?.data;
    }
}
