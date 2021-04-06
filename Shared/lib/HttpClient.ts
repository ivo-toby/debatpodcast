/**
 * Taken from : https://levelup.gitconnected.com/enhance-your-http-request-with-axios-and-typescript-f52a6c6c2c8e
 */
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import https from 'https';
import { CacheFactory } from './db/factories';

abstract class HttpClient {
    protected readonly instance: AxiosInstance;

    protected cache: CacheFactory;

    protected baseURL: string;

    public constructor(baseURL: string) {
        this.baseURL = baseURL;
        this.instance = axios.create({
            baseURL,
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
            }),
            headers: {
                'Content-Type': 'application/json',
                TE: 'Trailers',
                DNT: 1,
            },
        });
        this._initializeResponseInterceptor();
        this.cache = new CacheFactory();
    }

    protected _initializeResponseInterceptor = () => {
        this.instance.interceptors.response.use(
            this._handleResponse,
            this._handleError,
        );
    };

    protected _handleResponse = ({ data }: AxiosResponse) => {
        return data.data ? data.data : data;
    };

    protected _handleError = (error: any) => Promise.reject(error);

    public async get<T>(endPoint: string, forceDownload = false): Promise<T> {
        let result: T;
        const cached = await this.cache.getCached<T>('apiCall', endPoint);
        if (!cached || forceDownload) {
            result = await this.instance.get<string, T>(
                `${this.baseURL}${endPoint}`,
            );
            this.cache.add('apiCall', endPoint, result);
        } else {
            result = cached as T;
        }

        return result;
    }
}

export default HttpClient;
