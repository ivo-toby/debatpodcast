interface IApiError {
    message: string;
    error?: any;
    responseCode: number
}
export default abstract class AbstractError extends Error implements IApiError {
    error?: any;

    responseCode: number;

    constructor(e: Error, responseCode: number = 500) {
        super(e.message);
        this.error = e;
        this.responseCode = responseCode;
    }
}
