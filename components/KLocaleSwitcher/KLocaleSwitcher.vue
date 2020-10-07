<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-btn v-bind="$attrs"
           v-on="$listeners"
           :id="'localeSwitcher_' + _uid"
    >
        <span>{{ currentLocale }}</span>
        <v-icon class="mr-n1">arrow_drop_down</v-icon>

        <v-menu eager :activator="'#localeSwitcher_' + _uid">
            <v-list>
                <v-list-item
                    v-for="available in getAvailableLocales"
                    :key="available.code"
                    @click="$emit('change', available.code)"
                    :disabled="currentLocale === available.code"
                >
                    <v-list-item-content>
                        <v-list-item-title v-text="available.label"></v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-menu>
    </v-btn>
</template>

<script lang="ts">
    import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KLocaleSwitcher extends Vue {
        @Prop({type: String})
        public locale!: string;

        @Prop({type: Array, default: () => {
            return [];
        }})
        public availableLocales: string[];

        public get currentLocale(): string {
            return this.locale || this.$store.state.i18n.locale;
        }

        public get getAvailableLocales(): AvailableLocale[] {
            const values: Array<string> = Object.assign([], this.availableLocales);
            const dn = new Intl.DisplayNames([this.$store.state.i18n.locale], {
                type: 'language',
                style: 'long',
            });
            const locales: AvailableLocale[] = [];

            if (values.indexOf(this.currentLocale) < 0) {
                values.push(this.currentLocale);
            }

            values.forEach((locale: string) => {
                const label = dn.of(locale);

                locales.push({
                    code: locale,
                    label: label.charAt(0).toUpperCase() + label.slice(1),
                });
            });

            locales.sort((a: AvailableLocale, b: AvailableLocale) => {
                return a.label.localeCompare(b.label);
            });

            return locales;
        }
    }

    interface AvailableLocale {
        code: string;
        label: string;
    }
</script>
