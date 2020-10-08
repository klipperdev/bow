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
                        <v-list-item-title v-text="available.name"></v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-menu>
    </v-btn>
</template>

<script lang="ts">
    import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {AvailableLocale} from '@klipper/bow/i18n/AvailableLocale';

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
            const locale = this.locale || this.$store.state.i18n.locale;

            if (this.availableLocales.length > 0 && this.availableLocales.indexOf(locale) < 0) {
                return this.availableLocales[0];
            }

            return locale;
        }

        public get getAvailableLocales(): AvailableLocale[] {
            return this.$localeFormatter.getAvailableLocales(
                this.$store.state.i18n.locale,
                this.currentLocale,
                this.availableLocales
            );
        }
    }
</script>
