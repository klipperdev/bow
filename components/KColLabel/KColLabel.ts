/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {inject as RegistrableInject} from '@klipper/bow/mixins/Registrable';
import {Themeable} from '@klipper/bow/mixins/Themeable';
import {randomNumberBetween} from '@klipper/bow/utils/number';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KColLabel extends mixins(
    Themeable,
    RegistrableInject<'loaderWrapper', any>('loaderWrapper'),
) {
    @Prop({type: String})
    public label?: string;

    @Prop({type: Boolean, default: false})
    public hideLabel: boolean;

    @Prop({type: Boolean, default: false})
    public unwrap: boolean;

    @Prop({type: String, default: 'primary--text'})
    public labelColor: string;

    @Prop({type: String, default: 'text--lighten-2'})
    public labelDarkColor: string;

    @Prop({type: Boolean, default: false})
    public vertical: boolean;

    @Prop({type: Boolean, default: false})
    public editMode: boolean;

    @Prop({type: Boolean, default: false})
    public editLabelRequired: boolean;

    @Prop({type: [Boolean, String], default: false})
    public editTranslate!: boolean|string;

    @Prop({type: Boolean, default: false})
    public loading: boolean;

    @Prop({type: Object})
    public colProps!: object|undefined;

    @Prop({type: Object})
    public skeletonLoaderProps!: object;

    @Prop({type: Boolean, default: false})
    public empty: boolean;

    /**
     * Content width average used to create the skeleton loader
     */
    @Prop({type: String, default: 'random'})
    public contentWidth!: string|undefined;

    private dynamicLoading: boolean = false;

    private get isEmpty(): boolean {
        return this.empty && !this.editMode;
    }

    private get isLoading(): boolean {
        return this.loading || this.dynamicLoading;
    }

    private get bindSlotData(): any {
        return {
            label: this.label,
            hideLabel: this.hideLabel,
            labelColor: this.labelColor,
            labelDarkColor: this.labelDarkColor,
            vertical: this.vertical,
            editMode: this.editMode,
        };
    }

    private get colPropsValue(): object {
        return Object.assign({cols: 12, sm: 6}, this.colProps || {});
    }

    private get skeletonLoaderPropsValue(): Dictionary<any> {
        let contentWidth = this.contentWidth || undefined;

        if ('random' === contentWidth) {
            contentWidth = randomNumberBetween(30, 80) + '%';
        }

        return Object.assign(
            {class: 'mt-1', type: 'text', width: contentWidth},
            this.skeletonLoaderProps || {},
        );
    }

    private get rowClasses(): object {
        return {
            'k-col-label-row': true,
            'k-col-label-vertical': this.vertical,
            'k-col-label-empty': this.isEmpty,
            ...this.themeClasses,
        };
    }

    private get labelClasses(): object {
        return this.$classes({
            'k-col-label': true,
            'font-weight-bold': true,
            'word-break-word': true,
            'text-md-right': true,
            [this.labelColor]: true,
        }, {
            [this.labelDarkColor]: true,
        });
    }

    private get hasBadgeTranslate(): boolean {
        return !!this.editTranslate;
    }

    private get badgeTranslateContent(): string|undefined {
        return typeof this.editTranslate === 'string' ? this.editTranslate : undefined;
    }

    private get badgeTranslateIcon(): string|undefined {
        return typeof this.editTranslate === 'boolean' && this.editTranslate ? 'translate' : undefined;
    }

    public created(): void {
        if ((this as any).loaderWrapper) {
            (this as any).loaderWrapper.register(this);
        }
    }

    public beforeDestroy(): void {
        if ((this as any).loaderWrapper) {
            (this as any).loaderWrapper.unregister(this);
        }
    }

    public setLoading(loading: boolean): void {
        this.dynamicLoading = loading;
    }
}
