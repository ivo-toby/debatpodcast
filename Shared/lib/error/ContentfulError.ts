import AbstractError from './AbstractError';

type ContentFulError = {
    message: string;
    locations: Array<any>,
    extensions: any,
};

type ContentFulErrorLocation = {
    line: number;
    column: number;
};

export default class ContentfulError extends AbstractError {
    constructor(e: Error) {
        super(e);

        this.message = `Contentful error : ${this.error.message} `;
        if (this.error.response?.status) {
            this.message += `[${this.error.response.status} - ${this.error.response.statusText}]: \n
            ${this.contentFulErrors()}`;
            this.responseCode = this.error.response.status;
        }
    }

    contentFulErrors(): string {
        if (this.error.response.data) {
            const errors: Array<string> = this.error.response.data.errors.map(this.createErrorMessage);
            return errors.join(',  ');
        }
        return this.error.message;
    }

    createErrorMessage(cfError: ContentFulError): string {
        if (cfError.locations) {
            const locationsString = cfError.locations.map((loc: ContentFulErrorLocation): string => `line ${loc.line}, column:${loc.column}`).join(',');
            return `${cfError.message} (${locationsString})`;
        }
        return cfError.message;
    }
}
