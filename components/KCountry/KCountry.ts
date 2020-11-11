/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KCountry extends mixins(
    SlotWrapper,
) {
    @Prop({type: String, default: '~'})
    public defaultValue!: string;

    private get genValue(): any {
        return this.$country(this.$attrs.value, this.defaultValue);
    }
}
