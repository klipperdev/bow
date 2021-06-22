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
export default class KAddress extends mixins(
    SlotWrapper,
) {
    @Prop({required: true, default: null})
    public value!: Dictionary<any>|null;

    @Prop({type: Boolean, default: false})
    public hideStreet!: boolean;

    @Prop({type: Boolean, default: false})
    public hideStreetComplement!: boolean;

    @Prop({type: Boolean, default: false})
    public hidePostalCode!: boolean;

    @Prop({type: Boolean, default: false})
    public hideCity!: boolean;

    @Prop({type: Boolean, default: false})
    public hideState!: boolean;

    @Prop({type: Boolean, default: false})
    public hideCountry!: boolean;

    @Prop({type: Boolean, default: false})
    public inline!: boolean;

    protected get classes(): Dictionary<boolean> {
        return {
            'k-address': true,
        };
    }

    private get genValue(): string|undefined {
        let address = '';

        if (typeof this.value === 'object') {
            const street = this.value?.street;
            const streetComplement = this.value?.street_complement;
            const postalCode = this.value?.postal_code;
            const city = this.value?.city;
            const state = this.value?.state;
            const country = this.value?.country;

            if (street && !this.hideStreet) {
                address += street;
            }

            if (streetComplement && !this.hideStreetComplement) {
                address += (address ? '\n' : '') + streetComplement;
            }

            if (postalCode && !this.hidePostalCode) {
                address += (address ? '\n' : '') + postalCode;

                if (city) {
                    address += ' ' + city;
                }
            } else if (city && !this.hideCity) {
                address += (address ? '\n' : '') + city;
            }

            if (state && !this.hideState) {
                address += (address ? '\n' : '') + state;
            }

            if (country && !this.hideCountry) {
                address += (address ? '\n' : '') + this.$country(country);
            }
        }

        if (this.inline && address) {
            return address.replaceAll('\n', ' ');
        }

        return address || undefined;
    }

    private get getProps(): Dictionary<any> {
        return Object.assign({
            class: this.classes,
            value: this.genValue,
        }, this.$attrs);
    }
}
