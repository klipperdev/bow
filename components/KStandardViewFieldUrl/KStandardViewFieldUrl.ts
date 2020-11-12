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
export default class KStandardViewFieldUrl extends mixins(
    StandardViewFieldable,
    SlotWrapper,
) {
    @Prop({type: Boolean, default: false})
    public noProtocol!: boolean;

    protected get genFieldEditProps(): Dictionary<any> {
        return Object.assign({
            'no-protocol': this.noProtocol,
        }, this.genEditProps);
    }
}
