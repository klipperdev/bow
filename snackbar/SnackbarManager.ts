/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {SnackbarMessage} from '@klipper/bow/snackbar/SnackbarMessage';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class SnackbarManager {
    public snack(message: SnackbarMessage|string): void {
        if (window) {
            window.dispatchEvent(new MessageEvent('klipper-snackbar-push-snack', {
                data: typeof message === 'string' ? {message} : message,
            }));
        }
    }

    public primary(message: string): void {
        this.snack({message, color: 'primary'});
    }

    public secondary(message: string): void {
        this.snack({message, color: 'secondary'});
    }

    public accent(message: string): void {
        this.snack({message, color: 'accent'});
    }

    public success(message: string): void {
        this.snack({message, color: 'success'});
    }

    public info(message: string): void {
        this.snack({message, color: 'info'});
    }

    public warning(message: string): void {
        this.snack({message, color: 'warning'});
    }

    public error(message: string): void {
        this.snack({message, color: 'error'});
    }
}
