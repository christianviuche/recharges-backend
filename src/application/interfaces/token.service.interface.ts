export const ITokenService = Symbol('ITokenService');

export interface ITokenService {
    sign(payload: { sub: string; username: string }): Promise<string>;
}
