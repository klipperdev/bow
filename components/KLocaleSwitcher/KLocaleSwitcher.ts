/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Component, Vue, Prop, Ref, Watch} from 'vue-property-decorator';
import {AvailableLocale} from '@klipper/bow/i18n/AvailableLocale';
import {AvailableLocales} from '@klipper/bow/i18n/AvailableLocales';
import {Dictionary} from '@klipper/bow/generic/Dictionary';

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
        const filteredLocales = {} as Dictionary<any>;

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
