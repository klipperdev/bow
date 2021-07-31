/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {Selfable} from '@klipper/bow/mixins/Selfable';
import {Component, Prop} from 'vue-property-decorator';
import {mixins} from 'vue-class-component';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KAddressLabel extends mixins(
    Selfable,
) {
    @Prop({required: true, default: null})
    public value!: Dictionary<any>|null;

    @Prop({type: Boolean, default: false})
    public hideStreet!: boolean;

    @Prop({type: Boolean, default: true})
    public hideStreetComplement!: boolean;

    @Prop({type: Boolean, default: false})
    public hidePostalCode!: boolean;

    @Prop({type: Boolean, default: false})
    public hideCity!: boolean;

    @Prop({type: Boolean, default: true})
    public hideState!: boolean;

    @Prop({type: Boolean, default: false})
    public hideCountry!: boolean;
}
