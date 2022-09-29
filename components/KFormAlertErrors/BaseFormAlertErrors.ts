/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {getFilteredErrorChildren} from '@klipper/bow/utils/error';
import {Errors} from '@klipper/http-client/models/responses/Errors';
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default class BaseFormAlertErrors extends Vue {
    @Prop({type: [Object]})
    public errors!: Errors|undefined;

    @Prop({type: Array, default: () => []})
    public excludedChildren!: string[];

    @Prop({type: String})
    public metadata!: string;

    public get errorMessages(): string[] {
        return this.errors && this.errors.errors ? this.errors.errors : [];
    }

    public get filteredChildren(): Dictionary<Errors> {
        return this.errors ? getFilteredErrorChildren(this.errors, this.excludedChildren) : {};
    }
}
