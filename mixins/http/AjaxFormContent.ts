/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Component} from 'vue-property-decorator';
import {mixins} from 'vue-class-component';
import {FormContent} from '@klipper/bow/mixins/http/FormContent';
import {AjaxContent} from '@klipper/bow/mixins/http/AjaxContent';
import {getRequestErrorMessage} from '@klipper/bow/utils/error';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class AjaxFormContent extends mixins(FormContent, AjaxContent) {
    public get formAlert(): string|null {
        return this.previousError ? getRequestErrorMessage(this, this.previousError) : null;
    }

    public get showFormAlert(): boolean {
        return null !== this.formAlert;
    }
}
