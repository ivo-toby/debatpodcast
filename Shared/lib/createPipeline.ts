/* eslint-disable @typescript-eslint/type-annotation-spacing */
/**
 * 'next' function, passed to a middleware
 */
export type MiddlewareNext = () => void;

/**
 * A middleware
 */
export type Middleware<T> = (context: T, next: MiddlewareNext) => Promise<void> | void;

export type Pipeline<T> = {
    push: (...middlewares: Middleware<T>[]) => void
    execute: (context: T) => Promise<void>
};

export function createPipeline<T>(...middlewares: Middleware<T>[]): Pipeline<T> {
    const stack: Middleware<T>[] = middlewares;

    const push: Pipeline<T>['push'] = (...childMiddlewares) => {
        stack.push(...childMiddlewares);
    };

    const execute: Pipeline<T>['execute'] = async (context) => {
        let prevIndex = -1;

        const runner = async (index: number): Promise<void> => {
            if (index <= prevIndex) {
                throw new Error('next() called multiple times');
            }

            prevIndex = index;

            const middleware: Middleware<T> | undefined = stack[index];

            if (middleware) {
                await middleware(context, () => {
                    return runner(index + 1);
                });
            }
        };

        await runner(0);
    };

    return { push, execute };
}
