/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AjaxContent} from '@klipper/bow/composables/mixins/http/ajaxContent';
import {FormContent} from '@klipper/bow/composables/mixins/http/formContent';
import {getRequestErrorMessage} from '@klipper/bow/utils/error';
import {CancelerBag} from '@klipper/http-client/CancelerBag';
import {HttpClientRequestError} from '@klipper/http-client/errors/HttpClientRequestError';
import Vue from 'vue';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
interface Computed {
    get formAlert(): string|null;
    get showFormAlert(): boolean;
}

export const AjaxFormContent = Vue.extend<{}, {}, Computed>({
    name: 'ajaxFormContent',

    mixins: [
        FormContent,
        AjaxContent,
    ],

    computed: {
        formAlert(): string|null {
            return this.previousError ? getRequestErrorMessage(this, this.previousError) : null;
        },

        showFormAlert(): boolean {
            return !!this.previousError;
        },
    },
});
