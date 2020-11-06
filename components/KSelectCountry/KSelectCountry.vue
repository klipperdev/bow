<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-select
        ref="select"
        v-bind="selectAttrs"
        v-on="$listeners"
    >
        <template v-slot:prepend-item>
            <v-text-field
                v-model="search"
                full-width
                hide-details
                :label="$t('search')"
                prepend-inner-icon="search"
                single-line
                solo
                flat
                clearable
                dense
                autofocus
                autocomplete="off"
                color="accent"
            ></v-text-field>
        </template>

        <template v-slot:no-data>
            <k-no-result-message dense></k-no-result-message>
        </template>

        <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]>
            <slot :name="slot" />
        </template>
    </v-select>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {Country} from '@klipper/bow/i18n/Country';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component({
        inheritAttrs: false,
    })
    export default class KSelectCountry extends Vue {
        private search: string = '';

        public get items(): Country[] {
            const countries = this.$countryFormatter.countries();

            if (!this.search) {
                return countries;
            }

            return countries.filter((country: Country) => {
                return country.name.toLocaleLowerCase(this.$i18n.locale).includes(this.search.toLocaleLowerCase(this.$i18n.locale));
            });
        }

        public get selectAttrs(): any {
            const multiple = !!this.$attrs['multiple'] || '' === this.$attrs['multiple'];

            return Object.assign({
                dense: true,
                clearable: true,
                chips: multiple,
                'small-chips': multiple,
                'deletable-chips': multiple,
                'item-value': 'code',
                'item-text': 'name',
                placeholder: this.$t('select.placeholder'),
                items: this.items,
            }, this.$attrs);
        }

        public mounted(): void {
            this.$watch(() => this.$refs.select.$refs.menu.isActive, this.onOpen);
        }

        private async onOpen(open: boolean): Promise<void> {
            if (!open) {
                this.$refs.select.$refs.input.focus();
            }
        }
    }
</script>
