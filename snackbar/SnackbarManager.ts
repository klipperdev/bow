/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {SnackbarMessage} from './SnackbarMessage';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class SnackbarManager {
    public snack(message: SnackbarMessage): void {
        if (window) {
            window.dispatchEvent(new MessageEvent('klipper-snackbar-push-snack', {
                data: message,
            }));
        }
    }
}
