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
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KFormPhone extends mixins(
    SlotWrapper,
) {
    @Prop({type: String, default: 'phone', validator: (value: string) => {
        return -1 !== ['phone', 'mobile', 'fax'].indexOf(value);
    }})
    public type!: string;

    protected get genProps(): Dictionary<any> {
        const prependInnerIcon = this.$attrs['prepend-inner-icon'];
        let type: string = this.type;

        if ('mobile' === type) {
            type = 'mobile-alt';
        }

        return Object.assign({
            'prepend-inner-icon': undefined !== prependInnerIcon ? prependInnerIcon : 'fa fa-fw fa-' + type,
        }, this.$attrs);
    }
}
