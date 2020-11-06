export class ResponseResult {
    isSuccess: boolean = false;
    message: string = '';

    constructor(isSuccess: boolean, message: string) {
        this.isSuccess = isSuccess;
        this.message = message;
    }
}
