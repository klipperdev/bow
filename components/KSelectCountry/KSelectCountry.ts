/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {Country} from '@klipper/bow/i18n/Country';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {mixins} from 'vue-class-component';
import {Component, Ref, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component({
    inheritAttrs: false,
})
export default class KSelectCountry extends mixins(
    SlotWrapper,
) {
    @Ref('select')
    private readonly selectRef!: Vue|any;

    private search: string = '';

    private get items(): Country[] {
        const countries = this.$countryFormatter.countries();

        if (!this.search) {
            return countries;
        }

        return countries.filter((country: Country) => {
            return country.name.toLocaleLowerCase(this.$i18n.locale).includes(this.search.toLocaleLowerCase(this.$i18n.locale));
        });
    }

    private get selectAttrs(): Dictionary<any> {
        const multiple = !!this.$attrs.multiple || '' === this.$attrs.multiple;

        return Object.assign({
            'dense': true,
            'clearable': true,
            'chips': multiple,
            'small-chips': multiple,
            'deletable-chips': multiple,
            'item-value': 'code',
            'item-text': 'name',
            'placeholder': this.$t('select.placeholder'),
            'items': this.items,
        }, this.$attrs);
    }

    public mounted(): void {
        this.$watch(() => this.selectRef.$refs.menu.isActive, this.onOpen);
    }

    private async onOpen(open: boolean): Promise<void> {
        if (!open) {
            this.selectRef.$refs.input.focus();
        }
    }
}
