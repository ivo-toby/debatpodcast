import AbstractError from './AbstractError';

export default class Auth0Error extends AbstractError {
    constructor() {
        super(new Error('No bearertoken'), 401);
    }
}
