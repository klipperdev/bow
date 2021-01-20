/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {DataListFilterer} from '@klipper/bow/dataList/DataListFilterer';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {FormContent} from '@klipper/bow/mixins/http/FormContent';
import {inject as RegistrableInject} from '@klipper/bow/mixins/Registrable';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {QueryBuilderTransformer} from '@klipper/bow/queryBuilder/QueryBuilderTransformer';
import {replaceRouteQuery, restoreRouteQuery} from '@klipper/bow/utils/router';
import {FilterResult} from '@klipper/sdk/models/filters/FilterResult';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component({
    inheritAttrs: false,
})
export default class KQueryBuilder extends mixins(
    FormContent,
    SlotWrapper,
    RegistrableInject<'datalist', any>('datalist'),
) implements DataListFilterer {
    @Prop({type: Object})
    public dialogProps!: Dictionary<any>|undefined;

    @Prop({type: Boolean, default: false})
    public routeQuery!: boolean;

    @Prop({type: String})
    public routeQueryPrefix!: string|undefined;

    @Prop({type: Function, default: () => null})
    public filterTransformer!: QueryBuilderTransformer;

    private dialog: boolean = false;

    private data: Dictionary<any> = {};

    private transformedFilters: FilterResult = null;

    protected get buttonActivated(): boolean {
        return null !== this.transformedFilters;
    }

    protected get genDialogProps(): Dictionary<any> {
        return Object.assign({
            'eager': true,
            'max-width': '900',
            'persistent': false,
            'transition': '',
        }, this.dialogProps);
    }

    protected get genSlotProps(): Dictionary<any> {
        return {
            routeQuery: this.routeQuery,
            routeQueryPrefix: this.routeQueryPrefix,
            filter: this.filter,
            open: this.open,
            close: this.close,
            toggle: this.toggle,
            data: this.data,
        };
    }

    protected get isEmpty(): boolean {
        for (const key in this.data) {
            if (this.data.hasOwnProperty(key)
                && undefined !== this.data[key]
                && null !== this.data[key]
                && '' !== this.data[key]
            ) {
                return false;
            }
        }

        return true;
    }

    public created(): void {
        if ((this as any).datalist) {
            (this as any).datalist.register(this);
        }

        if (this.routeQuery) {
            this.data = restoreRouteQuery<Dictionary<any>>('qb', this.$route, this.routeQueryPrefix, undefined, 'object') || {};
        }
    }

    public mounted(): void {
        if (this.routeQuery && Object.keys(this.data).length > 0) {
            this.filter(false);
        }
    }

    public beforeDestroy(): void {
        if ((this as any).datalist) {
            (this as any).datalist.unregister(this);
        }
    }

    public getId(): number {
        return this._uid;
    }

    public getFilters(): FilterResult {
        return this.transformedFilters;
    }

    public reset(): void {
        this.data = {};
        this.transformedFilters = null;
        this.onChange();
    }

    public filter(emit: boolean = true): void {
        if (this.isValidForm()) {
            if (!!this.filterTransformer && !this.isEmpty) {
                this.transformedFilters = this.filterTransformer(this.data);
                this.onChange(emit);
            } else if (!!this.filterTransformer && (this.isEmpty && !!this.transformedFilters)) {
                this.transformedFilters = null;
                this.onChange(emit);
            }
        }
    }

    public open(): void {
        this.dialog = true;
    }

    public close(): void {
        this.dialog = false;
    }

    public isOpen(): boolean {
        return this.dialog;
    }

    public toggle(): void {
        if (this.isOpen()) {
            this.close();
        } else {
            this.open();
        }
    }

    private onChange(emit: boolean = true): void {
        if (this.routeQuery) {
            replaceRouteQuery({
                qb: Object.keys(this.data).length > 0 ? this.data : undefined,
            }, this.$route, this.routeQueryPrefix);
        }

        if (emit) {
            this.$emit('change');
        }
    }
}
