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
import {Selfable} from '@klipper/bow/mixins/Selfable';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {mixins} from 'vue-class-component';
import {Component, Prop, Ref, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component({
    inheritAttrs: false,
})
export default class KSelectCountry extends mixins(
    Selfable,
    SlotWrapper,
) {
    @Prop({type: Boolean, default: undefined})
    public selectFirst!: boolean;

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
        return Object.assign({
            'clearable': true,
            'chips': this.isMultiple,
            'small-chips': this.isMultiple,
            'deletable-chips': this.isMultiple,
            'item-value': 'code',
            'item-text': 'name',
            'placeholder': this.$t('select.placeholder'),
            'items': this.items,
        }, this.$attrs);
    }

    private get isMultiple(): boolean {
        return !!this.$attrs.multiple || '' === this.$attrs.multiple;
    }

    public mounted(): void {
        this.$watch(() => this.selectRef.$refs.menu.isActive, this.onOpen);

        if (this.selectFirst) {
            const countries = this.$countryFormatter.countries();

            if (countries.length > 0) {
                this.selectRef.setValue(this.isMultiple ? [countries[0].code] : countries[0].code);
            }
        }
    }

    private async onOpen(open: boolean): Promise<void> {
        if (!open) {
            this.selectRef.$refs.input.focus();
        }
    }
}
