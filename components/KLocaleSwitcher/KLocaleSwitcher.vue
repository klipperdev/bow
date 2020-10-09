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
           @click="onClickButton"
    >
        <span>{{ currentLocale }}</span>
        <v-icon class="mr-n1">arrow_drop_down</v-icon>

        <!-- Available locales of resource -->
        <v-menu v-model="open"
                :activator="'#localeSwitcher_' + _uid"
                eager
                :open-on-click="false"
                :close-on-content-click="false"
                transition="slide-y-transition"
                max-height="90vh"
        >
            <v-list>
                <v-list-item
                    v-if="allowAdd"
                    @click="onClickButtonAdd"
                >
                    <v-list-item-content>
                        <v-list-item-title v-text="$t('add.translation')"></v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-icon>
                        <v-icon color="accent" small>fa fa-fw fa-plus-circle</v-icon>
                    </v-list-item-icon>
                </v-list-item>

                <k-swipe-item
                    v-for="available in resourceAvailableLocales"
                    :key="available.code"
                    :disabled="currentLocale === available.code"
                    ref="availableLocaleItems"
                >
                    <template v-slot:action-right="{toggleRight}">
                        <v-btn class="btn-actions" block depressed color="error"
                               @click="deleteAvailableLocaleConfirm(available.code, toggleRight)"
                        >
                            {{ deleteConfirmationLabel || $t('delete') }}
                        </v-btn>
                    </template>

                    <template v-slot:default="{toggleRight}">
                        <v-list-item
                            @click.prevent="onSelectAvailableLocale(available.code)"
                            :disabled="currentLocale === available.code"
                        >
                            <v-list-item-content>
                                <v-list-item-title v-text="available.name"></v-list-item-title>
                            </v-list-item-content>

                            <v-list-item-action v-if="allowRemove">
                                <v-btn icon
                                       small
                                       color="error"
                                       :disabled="currentLocale === available.code"
                                       @click.stop="toggleRight()"
                                >
                                    <v-icon small>delete</v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                    </template>
                </k-swipe-item>
            </v-list>
        </v-menu>

        <!-- List all available locales -->
        <v-menu v-model="openStepAdd"
                :activator="'#localeSwitcher_' + _uid"
                eager
                :open-on-click="false"
                :close-on-content-click="false"
                :transition="openStepAdd ? 'slide-x-reverse-transition' : 'slide-y-transition'"
                min-width="300px"
                max-height="90vh"
        >
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
                autofocus
                color="accent"
            >
                <template #append>
                    <v-btn icon
                           ripple
                           color="accent"
                           @click="onClickButtonPrevious()"
                    >
                        <v-icon>fa fa-fw fa-chevron-circle-left</v-icon>
                    </v-btn>
                </template>
            </v-text-field>

            <v-list key="noResult" v-if="0 === countAllAvailableLocales">
                <k-no-result-message dense></k-no-result-message>
            </v-list>

            <v-list key="result" v-else>
                <v-list-item
                    v-for="available in allAvailableLocales"
                    :key="available.code"
                    :disabled="isLocaleAlreadyUsed(available.code)"
                    @click.prevent="onSelectNewAvailableLocale(available.code)"
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
    import {AvailableLocale} from '@klipper/bow/i18n/AvailableLocale';
    import {AvailableLocales} from '@klipper/bow/i18n/AvailableLocales';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KLocaleSwitcher extends Vue {
        @Prop({type: String})
        public locale!: string;

        @Prop({type: Boolean, default: false})
        public allowAdd: boolean;

        @Prop({type: Boolean, default: false})
        public allowRemove: boolean;

        @Prop({type: String, default: undefined})
        public deleteConfirmationLabel!: boolean;

        @Prop({type: Array, default: () => {
            return [];
        }})
        public availableLocales: string[];

        public open: boolean = false;

        private openStepAdd: boolean = false;

        private search: string|null = null;

        public get currentLocale(): string {
            const locale = this.locale || this.$store.state.i18n.locale;

            if (this.availableLocales.length > 0 && this.availableLocales.indexOf(locale) < 0) {
                return this.availableLocales[0];
            }

            return locale;
        }

        public get resourceAvailableLocales(): AvailableLocale[] {
            return this.$localeFormatter.getAvailableLocales(
                this.$store.state.i18n.locale,
                this.currentLocale,
                this.availableLocales
            );
        }

        public get allAvailableLocales(): AvailableLocales {
            const search = (this.search || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            const locales = this.$store.state.i18n.availableLocales as AvailableLocales;
            const filteredLocales = {};

            if (!search) {
                return locales;
            }

            Object.values(locales).forEach((availableLocale: AvailableLocale) => {
                if (availableLocale.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').indexOf(search) > -1) {
                    filteredLocales[availableLocale.code] = availableLocale;
                }
            });

            return filteredLocales;
        }

        public get countAllAvailableLocales(): number {
            return Object.keys(this.allAvailableLocales).length;
        }

        public onClickButton(): void {
            this.openStepAdd = false;
            this.open = true;
        }

        public onClickButtonAdd(): void {
            this.open = false;
            this.openStepAdd = true;
        }

        public onSelectAvailableLocale(locale: string): void {
            this.open = false;
            this.$emit('change', locale, false);
        }

        public onSelectNewAvailableLocale(locale: string): void {
            this.open = false;
            this.openStepAdd = false;
            this.$emit('change', locale, true);
        }

        public onClickButtonPrevious(): void {
            this.openStepAdd = false;
            this.open = true;
        }

        public isLocaleAlreadyUsed(locale: string): boolean {
            return this.availableLocales.length > 0 && this.availableLocales.indexOf(locale) >= 0;
        }

        @Watch('open')
        private watchOpen(value: boolean): void {
            if (!value && this.$refs.availableLocaleItems) {
                this.$refs.availableLocaleItems.forEach((item: any) => {
                    item.close();
                });
            }
        }

        @Watch('openStepAdd')
        private watchOpenStepAdd(value: boolean): void {
            if (value) {
                this.search = null;
            }
        }

        public deleteAvailableLocaleConfirm(locale: string, toggleRight: Function): void {
            toggleRight();
            this.open = false;
            this.openStepAdd = false;
            this.$emit('delete', locale);
        }
    }
</script>
