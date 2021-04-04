import AbstractError from './AbstractError';

export default class InvalidParameters extends AbstractError {
    constructor(invalidParameters: Array<string>) {
        super(new Error(`Invalid queryparameters (${invalidParameters.join(',')})`), 400);
    }
}
