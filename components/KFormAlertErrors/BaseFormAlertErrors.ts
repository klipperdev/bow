/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
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
        const children = this.errors && this.errors.children || {} as Dictionary<Errors>;
        const values = {} as Dictionary<Errors>;

        Object.getOwnPropertyNames(children).forEach((child: string) => {
            if (!this.excludedChildren.includes(child)) {
                values[child] = children[child];
            }
        });

        return values;
    }
}
