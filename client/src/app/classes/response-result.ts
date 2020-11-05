export class ResponseResult {
    isSuccess: boolean;
    message: string;

    constructor(isSuccess: boolean, message: string) {
        this.isSuccess = isSuccess;
        this.message = message;
    }
}
