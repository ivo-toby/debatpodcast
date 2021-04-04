export function parseNumber(maybeNumber: any, fallbackNumber: number): number {
    const parsedNumber = parseInt(maybeNumber, 10);
    if (Number.isNaN(parsedNumber)) {
        return fallbackNumber;
    }
    return parsedNumber;
}
