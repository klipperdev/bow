/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AjaxContent} from '@klipper/bow/mixins/http/AjaxContent';
import {FormContent} from '@klipper/bow/mixins/http/FormContent';
import {getRequestErrorMessage} from '@klipper/bow/utils/error';
import {mixins} from 'vue-class-component';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class AjaxFormContent extends mixins(FormContent, AjaxContent) {
    public get formAlert(): string|null {
        return this.previousError ? getRequestErrorMessage(this, this.previousError) : null;
    }

    public get showFormAlert(): boolean {
        return !!this.previousError;
    }
}
