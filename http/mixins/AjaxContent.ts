/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Component} from 'vue-property-decorator';
import {Canceler} from '@klipper/http-client/Canceler';
import {BaseAjaxContent} from './BaseAjaxContent';
import {SnackbarMessage} from '../../snackbar/SnackbarMessage';
import {getRequestErrorMessage} from '../../utils/error';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class AjaxContent extends BaseAjaxContent {
    /**
     * Fetch data.
     */
    public async fetchData<D>(request: (canceler: Canceler) => Promise<D | null>,
                              showSnackbar: boolean = true): Promise<D | null> {
        const canceler = new Canceler();
        this.cancelPreviousRequests();

        try {
            this.loading = true;
            this.previousError = null;
            this.previousRequests.push(canceler);

            const res: D|null = await request(canceler);
            this.removeCanceler(canceler);

            return res as D;
        } catch (e) {
            this.removeCanceler(canceler);
            this.previousError = e;
            this.loading = false;

            if (showSnackbar && this.$snackbar) {
                this.$snackbar.snack(new SnackbarMessage(getRequestErrorMessage(this, e), 'error'));
            }
        }

        return null;
    }
}
