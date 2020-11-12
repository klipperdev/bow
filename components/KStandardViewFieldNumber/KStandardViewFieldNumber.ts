/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {StandardViewFieldable} from '@klipper/bow/mixins/StandardViewFieldable';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KStandardViewFieldNumber extends mixins(
    StandardViewFieldable,
    SlotWrapper,
) {
    @Prop({type: String, default: 'number', validator: (value: string) => {
        return -1 !== ['number', 'percent', 'currency'].indexOf(value);
    }})
    public type!: string;

    @Prop({type: Number, default: undefined})
    public scale!: number;

    @Prop({type: [String, Boolean], default: undefined})
    public currency!: string|boolean|undefined;

    @Prop({type: Boolean, default: undefined})
    public percent!: boolean;

    @Prop({type: String, default: undefined})
    public display!: string;

    protected get genViewProps(): Dictionary<any> {
        return Object.assign({
            type: this.type,
            scale: undefined === this.scale ? this.genScale : this.scale,
            currency: this.currency,
            percent: this.percent,
            display: this.display,
        }, this.viewProps || {});
    }

    protected get genFieldEditProps(): Dictionary<any> {
        return Object.assign({
            scale: undefined === this.scale ? this.genScale : this.scale,
        }, this.genEditProps);
    }

    private get genScale(): number|undefined {
        return !!this.fieldMetadata
                && undefined !== this.fieldMetadata.inputConfig.scale
            ? this.fieldMetadata.inputConfig.scale
            : undefined;
    }
}
