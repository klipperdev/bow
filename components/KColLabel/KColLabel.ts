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
import {SkeletonLoaderable} from '@klipper/bow/mixins/SkeletonLoaderable';
import {Themeable} from '@klipper/bow/mixins/Themeable';
import {mergeMapClasses} from '@klipper/bow/utils/style';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KColLabel extends mixins(
    Themeable,
    SkeletonLoaderable,
    RegistrableInject<'loaderWrapper', any>('loaderWrapper'),
) {
    @Prop({type: String})
    public label?: string;

    @Prop({type: Boolean, default: false})
    public hideLabel: boolean;

    @Prop({type: Boolean, default: false})
    public unwrap: boolean;

    @Prop({type: String, default: undefined})
    public labelColor: string;

    @Prop({type: String, default: undefined})
    public labelDarkColor: string;

    @Prop({type: Boolean, default: false})
    public vertical: boolean;

    @Prop({type: Boolean, default: false})
    public single: boolean;

    @Prop({type: Boolean, default: false})
    public editMode: boolean;

    @Prop({type: Boolean, default: false})
    public editLabelRequired: boolean;

    @Prop({type: [Boolean, String], default: false})
    public editTranslate!: boolean|string;

    @Prop({type: Object})
    public rowProps!: Dictionary<any>|undefined;

    @Prop({type: Object})
    public colProps!: Dictionary<any>|undefined;

    @Prop({type: Object})
    public labelProps!: Dictionary<any>|undefined;

    @Prop({type: Object})
    public labelContentProps!: Dictionary<any>|undefined;

    @Prop({type: Boolean, default: false})
    public empty: boolean;

    @Prop({type: Boolean, default: false})
    public contentRight: boolean;

    private dynamicLoading: boolean = false;

    private get isEmpty(): boolean {
        return this.empty && !this.editMode;
    }

    private get isLoading(): boolean {
        return this.loading || (this.dynamicLoading && !this.disableLoading);
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

    private get rowPropsValue(): Dictionary<any> {
        return {
            ...this.rowProps,
            class: mergeMapClasses({}, this.rowClasses, this.rowProps?.class || {}),
        };
    }

    private get colPropsValue(): Dictionary<any> {
        return Object.assign({
            cols: 12,
            sm: this.single ? undefined : 6,
        }, this.colProps || {});
    }

    private get labelPropsValue(): Dictionary<any> {
        return Object.assign({
            cols: 12,
            sm: 5,
            lg: 3,
            class: this.labelClasses,
        }, this.labelProps || {});
    }

    private get labelContentPropsValue(): Dictionary<any> {
        return {
            ...this.labelContentProps,
            class: mergeMapClasses({}, this.labelContentClasses, this.labelContentProps?.class || {}),
        };
    }

    private get rowClasses(): Dictionary<any> {
        return {
            'k-col-label-row': true,
            'k-col-label-vertical': this.vertical,
            'k-col-label-empty': this.isEmpty,
            ...this.themeClasses,
        };
    }

    private get labelClasses(): Dictionary<any> {
        return this.$classes({
            'k-col-label': true,
            'font-weight-bold': true,
            'word-break-word': true,
            [this.labelColor]: true,
        }, {
            [this.labelDarkColor]: true,
        });
    }

    private get labelContentClasses(): Dictionary<any> {
        return this.$classes({
            'k-col-label-content': true,
            'd-flex': this.contentRight,
            'justify-end': this.contentRight,
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

    public setLoading(loading: boolean): void {
        this.dynamicLoading = loading;
    }
}
