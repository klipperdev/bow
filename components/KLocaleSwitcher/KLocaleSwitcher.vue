<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-btn
        v-bind="$attrs"
        v-on="$listeners"
        :id="'localeSwitcher_' + self._uid"
        @click="onClickButton"
    >
        <span class="text-uppercase">
            {{ currentLocale }}
        </span>

        <v-icon
            class="mr-n1"
        >
            arrow_drop_down
        </v-icon>

        <!-- Available locales of resource -->
        <v-menu
            v-model="open"
            :activator="'#localeSwitcher_' + self._uid"
            :open-on-click="false"
            :close-on-content-click="false"
            transition="slide-y-transition"
            min-width="200px"
            max-height="90vh"
        >
            <v-list>
                <v-list-item
                    v-if="allowAdd"
                    @click="onClickButtonAdd"
                >
                    <v-list-item-content>
                        <v-list-item-title
                            v-text="self.$t('add.translation')"
                        ></v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-icon>
                        <v-icon
                            color="primary"
                            small
                        >
                            fa-fw fa-plus-circle
                        </v-icon>
                    </v-list-item-icon>
                </v-list-item>

                <k-swipe-item
                    v-for="available in resourceAvailableLocales"
                    :key="available.code"
                    :disabled="currentLocale === available.code"
                    ref="availableLocaleItems"
                >
                    <template v-slot:action-right="{toggleRight}">
                        <v-btn
                            class="btn-actions"
                            block
                            depressed
                            color="error"
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
                                <v-list-item-title
                                    v-text="available.name"
                                />
                            </v-list-item-content>

                            <v-list-item-action
                                v-if="allowRemove"
                            >
                                <v-btn icon
                                       small
                                       color="error"
                                       :disabled="currentLocale === available.code"
                                       @click.stop="toggleRight()"
                                >
                                    <v-icon
                                        small
                                    >
                                        delete
                                    </v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                    </template>
                </k-swipe-item>
            </v-list>
        </v-menu>

        <!-- List all available locales -->
        <v-menu
            v-model="openStepAdd"
            :activator="'#localeSwitcher_' + self._uid"
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
                :label="self.$t('search')"
                prepend-inner-icon="search"
                single-line
                solo
                flat
                clearable
                autofocus
                color="primary"
            >
                <template v-slot:append>
                    <v-btn
                        icon
                        ripple
                        color="primary"
                        @click="onClickButtonPrevious()"
                    >
                        <v-icon>
                            fa-fw fa-chevron-circle-left
                        </v-icon>
                    </v-btn>
                </template>
            </v-text-field>

            <v-list
                v-if="0 === countAllAvailableLocales"
                key="noResult"
            >
                <k-no-result-message dense />
            </v-list>

            <v-list
                v-else
                key="result"
            >
                <v-list-item
                    v-for="available of Object.values(allAvailableLocales)"
                    :key="available.code"
                    :disabled="isLocaleAlreadyUsed(available.code)"
                    @click.prevent="onSelectNewAvailableLocale(available.code)"
                >
                    <v-list-item-content>
                        <v-list-item-title v-text="available.name" />
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-menu>
    </v-btn>
</template>

<script lang="ts">
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {AvailableLocale} from '@klipper/bow/i18n/AvailableLocale';
import {AvailableLocales} from '@klipper/bow/i18n/AvailableLocales';
import {Selfable} from '@klipper/bow/mixins/Selfable';
import {mixins} from 'vue-class-component';
import {Component, Prop, Ref, Vue, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KLocaleSwitcher extends mixins(
    Selfable,
) {
    @Prop({type: String})
    public locale!: string;

    @Prop({type: Boolean, default: false})
    public allowAdd: boolean;

    @Prop({type: Boolean, default: false})
    public allowRemove: boolean;

    @Prop({type: String})
    public deleteConfirmationLabel!: boolean;

    @Prop({type: Array, default: () => []})
    public availableLocales: string[];

    @Ref('availableLocaleItems')
    protected readonly availableLocaleItemsRef!: Array<Vue|any>;

    private open: boolean = false;

    private openStepAdd: boolean = false;

    private search: string|null = null;

    private get currentLocale(): string {
        const locale = this.locale || this.$store.state.i18n.locale;

        if (this.availableLocales.length > 0 && this.availableLocales.indexOf(locale) < 0) {
            return this.availableLocales[0];
        }

        return locale;
    }

    private get resourceAvailableLocales(): AvailableLocale[] {
        return this.$localeFormatter.getAvailableLocales(
            this.$store.state.i18n.locale,
            this.currentLocale,
            this.availableLocales,
        );
    }

    private get allAvailableLocales(): AvailableLocales {
        const search = (this.search || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const locales = this.$store.state.i18n.availableLocales as AvailableLocales;
        const filteredLocales = {} as Dictionary<AvailableLocale>;

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

    private get countAllAvailableLocales(): number {
        return Object.keys(this.allAvailableLocales).length;
    }

    private onClickButton(): void {
        this.openStepAdd = false;
        this.open = true;
    }

    private onClickButtonAdd(): void {
        this.open = false;
        this.openStepAdd = true;
    }

    private onSelectAvailableLocale(locale: string): void {
        this.open = false;
        this.$emit('change', locale, false);
    }

    private onSelectNewAvailableLocale(locale: string): void {
        this.open = false;
        this.openStepAdd = false;
        this.$emit('change', locale, true);
    }

    private onClickButtonPrevious(): void {
        this.openStepAdd = false;
        this.open = true;
    }

    private isLocaleAlreadyUsed(locale: string): boolean {
        return this.availableLocales.length > 0 && this.availableLocales.indexOf(locale) >= 0;
    }

    private deleteAvailableLocaleConfirm(locale: string, toggleRight: Function): void {
        toggleRight();
        this.open = false;
        this.openStepAdd = false;
        this.$emit('delete', locale);
    }

    @Watch('open')
    private watchOpen(value: boolean): void {
        if (!value && this.availableLocaleItemsRef) {
            this.availableLocaleItemsRef.forEach((item) => {
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
}
</script>
