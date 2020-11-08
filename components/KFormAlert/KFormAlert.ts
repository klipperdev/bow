/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Component, Prop, Vue} from 'vue-property-decorator';
import {HttpClientRequestError} from '@klipper/http-client/errors/HttpClientRequestError';
import {Errors} from '@klipper/http-client/models/responses/Errors';
import {getRequestErrorMessage, getFormAlertFields, getFormAlertGlobal} from '@klipper/bow/utils/error';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KFormAlert extends Vue {
    @Prop({type: Object})
    public httpError!: HttpClientRequestError|undefined;

    @Prop({type: Array, default: () => []})
    public excludedFields!: string[];

    @Prop({type: String})
    public metadata!: string;

    private get formAlert(): string | null {
        return this.httpError ? getRequestErrorMessage(this, this.httpError) : null;
    }

    private get showFormAlert(): boolean {
        return !!this.httpError;
    }

    private getFormAlertGlobalErrors(): string[] {
        return this.httpError ? getFormAlertGlobal(this.httpError) : [];
    }

    private getFormAlertFields(excludedChildren: string[] = []): Record<string, Errors> {
        return this.httpError ? getFormAlertFields(this.httpError, excludedChildren) : {};
    }
}
