<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div
        v-if="!!$scopedSlots.fields"
        class="k-query-builder"
    >
        <slot
            name="activator"
            v-bind="genSlotProps"
        >
            <v-btn
                depressed
                small
                :plain="!buttonActivated"
                :color="buttonActivated ? 'primary' : undefined"
                @click="toggle"
            >
                <v-icon
                    small
                >
                    fa-fw fa-sliders-h
                </v-icon>
            </v-btn>
        </slot>

        <v-dialog
            v-bind="genDialogProps"
            v-model="dialog"
        >
            <v-card>
                <v-card-title
                    :class="$classes('primary--text', 'text--lighten-2')"
                >
                    <slot
                        name="form-title"
                    >
                        {{ $t('search') }}
                    </slot>
                </v-card-title>

                <v-form
                    ref="form"
                    class="v-card__content-scroller"
                    style="max-height: calc(82vh - 120px);"
                    @submit.prevent=""
                >
                    <slot
                        name="fields"
                        v-bind="genSlotProps"
                    />
                </v-form>

                <v-card-actions>
                    <v-spacer />

                    <v-btn
                        text
                        ripple
                        @click="close()"
                    >
                        {{ $t('close') }}
                    </v-btn>

                    <v-btn
                        text
                        ripple
                        color="primary"
                        @click="reset()"
                    >
                        {{ $t('reset') }}
                    </v-btn>

                    <v-btn
                        color="primary"
                        depressed
                        ripple
                        @click="filter()"
                    >
                        {{ $t('filter') }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <slot
            name="default"
        />
    </div>
</template>

<script lang="ts">
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
            reset: this.reset,
            data: this.data,
            isEmpty: this.isEmpty,
            isOpen: this.isOpen,
            count: this.count,
            buttonActivated: this.buttonActivated,
        };
    }

    protected get count(): number {
        let count = 0;

        for (const key in this.data) {
            if (this.data.hasOwnProperty(key)
                && undefined !== this.data[key]
                && null !== this.data[key]
                && '' !== this.data[key]
                && !(typeof this.data[key] === 'object' && Array.isArray(this.data[key]) && 0 === this.data[key].length)
            ) {
                ++count;
            }
        }

        return count;
    }

    protected get isEmpty(): boolean {
        for (const key in this.data) {
            if (this.data.hasOwnProperty(key)
                && undefined !== this.data[key]
                && null !== this.data[key]
                && '' !== this.data[key]
                && !(typeof this.data[key] === 'object' && Array.isArray(this.data[key]) && 0 === this.data[key].length)
            ) {
                return false;
            }
        }

        return true;
    }

    public get isOpen(): boolean {
        return this.dialog;
    }

    public created(): void {
        if (this.routeQuery) {
            this.data = restoreRouteQuery<Dictionary<any>>('qb', this.$route, this.routeQueryPrefix, undefined, 'object') || {};
        }
    }

    public mounted(): void {
        if (this.routeQuery && !this.isEmpty) {
            this.filter(false);
        }
    }

    public getId(): number {
        return this._uid;
    }

    public getFilters(): FilterResult {
        return this.transformedFilters;
    }

    public reset(): void {
        this.resetForm();
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

    public toggle(): void {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    private onChange(emit: boolean = true): void {
        if (this.routeQuery) {
            replaceRouteQuery({
                qb: this.optimizeData(),
            }, this.$route, this.routeQueryPrefix);
        }

        if (emit) {
            this.$emit('change');
        }
    }

    private optimizeData(): Dictionary<any>|undefined {
        if (this.isEmpty) {
            return undefined;
        }

        const data = {} as Dictionary<any>;

        for (const key in this.data) {
            if (this.data.hasOwnProperty(key) && ![undefined, null, ''].includes(this.data[key])) {
                if (typeof this.data[key] === 'object' && Array.isArray(this.data[key]) && 0 === this.data[key].length) {
                    continue;
                }

                data[key] = this.data[key];
            }
        }

        return data;
    }
}
</script>
