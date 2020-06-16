/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface AuthState {
    authenticated: boolean;
    authenticationPending: boolean;
    refreshPending: boolean;
    logoutPending: boolean;
    tokenType: string|null;
    createdAt: Date|null;
    expiresIn: number|null;
    accessToken: string|null;
    refreshToken: string|null;
}
