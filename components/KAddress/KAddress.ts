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
    public hideState!: boolean;

    @Prop({type: Boolean, default: false})
    public hideCountry!: boolean;

    protected get classes(): Dictionary<boolean> {
        return {
            'k-address': true,
        };
    }

    private get genValue(): string|undefined {
        let address = '';

        if (typeof this.value === 'object') {
            const street = this.$oc<any>(this.value).street();
            const streetComplement = this.$oc<any>(this.value).street_complement();
            const postalCode = this.$oc<any>(this.value).postal_code();
            const city = this.$oc<any>(this.value).city();
            const state = this.$oc<any>(this.value).state();
            const country = this.$oc<any>(this.value).country();

            if (street) {
                address += street;
            }

            if (streetComplement) {
                address += (address ? '\n' : '') + streetComplement;
            }

            if (postalCode) {
                address += (address ? '\n' : '') + postalCode;

                if (city) {
                    address += ' ' + city;
                }
            } else if (city) {
                address += (address ? '\n' : '') + city;
            }

            if (state && !this.hideState) {
                address += (address ? '\n' : '') + state;
            }

            if (country && !this.hideCountry) {
                address += (address ? '\n' : '') + this.$country(country);
            }
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