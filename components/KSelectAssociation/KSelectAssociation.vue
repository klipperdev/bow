<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-select
        v-if="!autocomplete && !combobox"
        ref="select"
        v-bind="selectAttrs"
        v-on="$listeners"
        @blur="onBlur"
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
                color="primary"
            />

            <k-menu-pagination
                v-if="paginationPages > 1"
                :page="page"
                :limit="limit"
                :pages="paginationPages"
                :total="paginationTotal"
                @previous="previousPage"
                @next="nextPage"
            />

            <v-progress-linear
                v-if="loading"
                indeterminate
                absolute
                color="primary"
                :height="$attrs['loader-height'] || 2"
            />

            <slot
                name="prepend-item-content"
                :items="items"
                :search="search"
                :loading="loading"
            />
        </template>

        <template v-slot:append-item>
            <k-menu-pagination
                v-if="paginationPages > 1"
                :page="page"
                :limit="limit"
                :pages="paginationPages"
                :total="paginationTotal"
                @previous="previousPage"
                @next="nextPage"
            />

            <slot
                name="append-item-content"
                :items="items"
                :search="search"
                :loading="loading"
            />
        </template>

        <template v-slot:no-data>
            <v-list
                v-if="loading"
            >
                <v-list-item>
                    <k-loading
                        class="mt-1"
                        progress-color=""
                    ></k-loading>
                </v-list-item>
            </v-list>

            <slot
                v-else
                name="no-data-content"
                v-bind="selectNoDataContentAttrs"
            >
                <k-no-result-message
                    dense
                />
            </slot>
        </template>

        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]="props">
            <slot :name="slotItem.original" v-bind="props"/>
        </template>

        <template v-slot:append><slot name="append"/></template>
        <template v-slot:append-outer><slot name="append-outer"/></template>
        <template v-slot:prepend><slot name="prepend"/></template>
        <template v-slot:prepend-inner><slot name="prepend-inner"/></template>
    </v-select>

    <v-autocomplete
        v-else-if="autocomplete"
        ref="select"
        v-bind="selectAttrs"
        v-on="selectListeners"
    >
        <template v-slot:prepend-item>
            <k-menu-pagination
                v-if="paginationPages > 1"
                :page="page"
                :limit="limit"
                :pages="paginationPages"
                :total="paginationTotal"
                @previous="previousPage"
                @next="nextPage"
            />

            <v-progress-linear
                v-if="loading"
                indeterminate
                absolute
                color="primary"
                :height="$attrs['loader-height'] || 2"
            />

            <slot
                name="prepend-item-content"
                :items="items"
                :search="search"
                :loading="loading"
            />
        </template>

        <template v-slot:append-item>
            <k-menu-pagination
                v-if="paginationPages > 1"
                :page="page"
                :limit="limit"
                :pages="paginationPages"
                :total="paginationTotal"
                @previous="previousPage"
                @next="nextPage"
            />

            <slot
                name="append-item-content"
                :items="items"
                :search="search"
                :loading="loading"
            />
        </template>

        <template v-slot:no-data>
            <v-list
                v-if="loading"
            >
                <v-list-item>
                    <k-loading
                        class="mt-1"
                        progress-color=""
                    ></k-loading>
                </v-list-item>
            </v-list>

            <slot
                v-else
                name="no-data-content"
                v-bind="selectNoDataContentAttrs"
            >
                <k-no-result-message
                    dense
                />
            </slot>
        </template>

        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]="props">
            <slot :name="slotItem.original" v-bind="props"/>
        </template>

        <template v-slot:append><slot name="append"/></template>
        <template v-slot:append-outer><slot name="append-outer"/></template>
        <template v-slot:prepend><slot name="prepend"/></template>
        <template v-slot:prepend-inner><slot name="prepend-inner"/></template>
    </v-autocomplete>

    <v-combobox
        v-else
        ref="select"
        v-bind="selectAttrs"
        v-on="selectListeners"
    >
        <template v-slot:prepend-item>
            <k-menu-pagination
                v-if="paginationPages > 1"
                :page="page"
                :limit="limit"
                :pages="paginationPages"
                :total="paginationTotal"
                @previous="previousPage"
                @next="nextPage"
            />

            <v-progress-linear
                v-if="loading"
                indeterminate
                absolute
                color="primary"
                :height="$attrs['loader-height'] || 2"
            />

            <slot
                name="prepend-item-content"
                :items="items"
                :search="search"
                :loading="loading"
            />
        </template>

        <template v-slot:append-item>
            <k-menu-pagination
                v-if="paginationPages > 1"
                :page="page"
                :limit="limit"
                :pages="paginationPages"
                :total="paginationTotal"
                @previous="previousPage"
                @next="nextPage"
            />

            <slot
                name="append-item-content"
                :items="items"
                :search="search"
                :loading="loading"
            />
        </template>

        <template v-slot:no-data>
            <v-list
                v-if="loading"
            >
                <v-list-item>
                    <k-loading
                        class="mt-1"
                        progress-color=""
                    ></k-loading>
                </v-list-item>
            </v-list>

            <slot
                v-else
                name="no-data-content"
                v-bind="selectNoDataContentAttrs"
            >
                <k-no-result-message
                    dense
                />
            </slot>
        </template>

        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]="props">
            <slot :name="slotItem.original" v-bind="props"/>
        </template>

        <template v-slot:append><slot name="append"/></template>
        <template v-slot:append-outer><slot name="append-outer"/></template>
        <template v-slot:prepend><slot name="prepend"/></template>
        <template v-slot:prepend-inner><slot name="prepend-inner"/></template>
    </v-combobox>
</template>

<script lang="ts">
import {formable} from '@klipper/bow/composables/mixins/formable';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {FetchRequestDataListEvent} from '@klipper/bow/http/event/FetchRequestDataListEvent';
import {FetchRequestDataListFunction} from '@klipper/bow/http/request/FetchRequestDataListFunction';
import {AjaxListContent} from '@klipper/bow/mixins/http/AjaxListContent';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {getPropertyFromItem} from '@klipper/bow/utils/object';
import {Canceler} from '@klipper/http-client/Canceler';
import {ListResponse} from '@klipper/http-client/models/responses/ListResponse';
import {FilterCondition} from '@klipper/sdk/models/filters/FilterCondition';
import {FilterResult} from '@klipper/sdk/models/filters/FilterResult';
import {FilterRule} from '@klipper/sdk/models/filters/FilterRule';
import {Sort} from '@klipper/sdk/requests/Sort';
import {mixins} from 'vue-class-component';
import {Component, Prop, Ref, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component({
    inheritAttrs: false,
})
export default class KSelectAssociation extends mixins(
    AjaxListContent,
    SlotWrapper,
    formable('select'),
) {
    @Prop({type: Function})
    public fetchRequest!: FetchRequestDataListFunction;

    @Prop({type: Function})
    public resultTransformer!: Function;

    @Prop({type: [Function, Boolean]})
    public sortTransformer!: Function|boolean;

    @Prop({type: String})
    public targetMetadata!: string;

    @Prop({type: Number, default: 100})
    public initLimit!: number;

    @Prop({type: Object})
    public filters!: FilterCondition|FilterRule;

    @Prop({type: [Sort, String, Array]})
    public sort!: Sort|Sort[]|string|string[];

    @Prop({type: [Array, Boolean], default: () => []})
    public fields!: string[]|boolean;

    @Prop({type: Array, default: () => []})
    public searchFields!: string[];

    @Prop({type: Boolean, default: false})
    public selectFirst!: boolean;

    @Prop({type: Boolean, default: false})
    public autocomplete!: boolean;

    @Prop({type: Boolean, default: false})
    public combobox!: boolean;

    @Prop({type: Boolean, default: false})
    public autocompleteChips!: boolean;

    @Prop({type: Boolean, default: false})
    public details!: boolean;

    @Prop({type: String})
    public itemTextRequest!: string;

    @Prop({type: Boolean, default: false})
    public refreshOnInit!: boolean;

    @Prop({type: Function})
    public itemTextRequestFilter!: (value: string|null, itemText: string|(() => string)) => FilterResult;

    @Ref('select')
    private readonly selectRef!: Vue|any;

    private initValueTemp: any|null;

    private textValueTemp: string|null;

    public get hasError(): boolean {
        return !!this.selectRef && this.selectRef.hasError;
    }

    private get isMetadataInitialized(): boolean {
        return undefined === this.$store.state.metadata || this.$store.state.metadata.initialized;
    }

    private get selectAttrs(): Dictionary<any> {
        const multiple = !!this.$attrs.multiple || '' === this.$attrs.multiple;
        const autoCompleteAttrs = !this.autocomplete ? {} : {
            filter: () => true,
        };

        return Object.assign({
            'loading': this.loading,
            'clearable': !multiple,
            'chips': multiple || (this.autocomplete && this.autocompleteChips),
            'small-chips': multiple || (this.autocomplete && this.autocompleteChips),
            'deletable-chips': multiple,
            'return-object': true,
            'item-value': this.itemValue,
            'item-text': this.itemText,
            'placeholder': this.$t('select.placeholder'),
            'items': this.items,
        }, autoCompleteAttrs, this.$attrs);
    }

    private get selectListeners(): Dictionary<any> {
        return Object.assign({
            'update:search-input': this.updateSearchInput,
            'blur': this.onBlur,
        }, this.$listeners);
    }

    private get selectNoDataContentAttrs(): Dictionary<any> {
        return {
            search: this.search,
            setValue: this.setValue,
            reset: this.reset,
        };
    }

    private get itemValue(): string|(() => string) {
        if (this.$attrs['item-value']) {
            return this.$attrs['item-value'];
        }

        return this.targetMetadata && this.$store.state.metadata && this.$store.state.metadata.metadatas[this.targetMetadata]
            ? this.$store.state.metadata.metadatas[this.targetMetadata].fieldIdentifier
            : 'id';
    }

    private get itemText(): string|(() => string) {
        if (this.$attrs['item-text']) {
            return this.$attrs['item-text'];
        }

        return this.targetMetadata && this.$store.state.metadata && this.$store.state.metadata.metadatas[this.targetMetadata]
            ? this.$store.state.metadata.metadatas[this.targetMetadata].fieldLabel
            : 'id';
    }

    private get requestFields(): string[] {
        let iFields = this.fields;

        if (false === iFields) {
            return [];
        } else if (!Array.isArray(iFields)) {
            iFields = [];
        }

        const fields = [];

        if (typeof this.itemValue === 'string') {
            fields.push(this.itemValue);
        }

        if (typeof this.itemText === 'string') {
            fields.push(this.itemText);
        }

        return [
            ...fields,
            ...iFields,
        ];
    }

    private get paginationPages(): number {
        return Math.ceil(this.paginationTotal / this.limit);
    }

    private get paginationTotal(): number {
        const hideSelected = !!this.selectAttrs['hide-selected'] || '' === this.selectAttrs['hide-selected'];

        if (hideSelected) {
            const res = this.total - this.getSelectValue().length;

            return res >= 0 ? res : 0;
        }

        return this.total;
    }

    public async mounted(): Promise<void> {
        if (!this.fetchRequest && !this.targetMetadata) {
            throw new Error('The "targetMetadata" props or the "fetchRequest" props must be defined');
        }

        if (undefined !== this.initLimit) {
            this.limit = this.initLimit;
        }

        this.items = this.getSelectValue();

        this.$watch(() => this.selectRef.$refs.menu.isActive, this.onOpen);

        if (!this.targetMetadata || (!!this.targetMetadata && this.isMetadataInitialized)) {
            await this.selectFirstItem();
            await this.refreshItemsOnInit();
        }
    }

    public async initValue<T = any>(value: T|null): Promise<void> {
        this.initValueTemp = value || null;

        if (!!value) {
            await this.refresh();

            if (this.items.length > 0) {
                this.setValue(this.items[0]);
            } else {
                this.setValue(null);
            }
        }

        this.initValueTemp = null;
    }

    public async setValueByText<T = any>(value: string|null, defaultValue: T|null = null): Promise<void> {
        this.textValueTemp = value || null;

        if (!!value) {
            await this.refresh();

            if (this.combobox && this.items.length > 0 && typeof this.items[0] !== 'object') {
                this.items = [];
            }

            if (this.items.length > 0 && typeof this.items[0] === 'object') {
                this.setValue(this.items[0]);
            } else {
                this.setValue(defaultValue);
            }
        }

        this.textValueTemp = null;
    }

    public setValue(value?: any): void {
        if (!value) {
            this.reset();

            return;
        }

        let valueExist: Dictionary<any>|null = null;

        for (const item of this.items) {
            const itemValue = typeof this.itemValue === 'function' ? this.itemValue() : this.itemValue;

            const valueItem = typeof item === 'object' ? (item as any)[itemValue] : undefined;
            const valueValue = typeof value === 'object' ? (value as any)[itemValue] : undefined;

            if (undefined !== valueItem && valueItem === valueValue) {
                valueExist = item;
                break;
            }
        }

        if (valueExist && typeof value === 'object') {
            Object.assign(valueExist, value);
        } else {
            this.items.push(value);
        }

        this.selectRef.selectItem(value);
    }

    public reset(): void {
        this.selectRef.reset();
        this.search = '';
        this.pages = -1;
        this.items = [];
    }

    public async fetchDataRequest(canceler: Canceler, searchValue: string): Promise<ListResponse<any>> {
        const event = new FetchRequestDataListEvent();
        event.page = this.page;
        event.limit = this.limit;
        event.pages = this.pages;
        event.total = this.total;
        event.search = searchValue ? searchValue : null;
        event.searchFields = this.searchFields.length > 0 ? this.searchFields : null;
        event.canceler = canceler;
        event.fields = this.requestFields;
        event.filters = this.filters || null;
        event.sort = this.sort;
        event.viewsDetails = this.details;

        if (!!this.initValueTemp) {
            event.search = null;
            event.limit = 1;
            event.filters = {
                field: this.itemValue,
                operator: 'equal',
                value: this.initValueTemp,
            } as FilterRule;
        } else if (!!this.textValueTemp) {
            event.search = null;
            event.limit = 1;

            if (typeof this.itemTextRequestFilter === 'function') {
                event.filters = this.itemTextRequestFilter(this.textValueTemp, this.itemText);
            } else {
                event.filters = {
                    field: !!this.itemTextRequest ? this.itemTextRequest : this.itemText,
                    operator: 'equal',
                    value: this.textValueTemp,
                } as FilterRule;
            }
        }

        const res = this.fetchRequest
            ? await this.fetchRequest(event)
            : await this.standardFetchRequest(event);

        if (this.resultTransformer) {
            this.resultTransformer(res);
        }

        return res;
    }

    protected hookAfterFetchDataRequest(): void {
        const itemValue = typeof this.itemValue === 'function' ? this.itemValue() : this.itemValue;
        const valueItems = [] as any[];
        let valueInjected = false;

        this.items.forEach((item: any) => {
            valueItems.push(item[itemValue]);
        });

        this.getSelectValue().forEach((item: any) => {
            if (null !== item[itemValue] && valueItems.indexOf(item[itemValue]) < 0) {
                this.items.push(item);
                valueInjected = true;
            }
        });

        if (valueInjected) {
            if (typeof this.sortTransformer === 'function') {
                this.items.sort(this.sortTransformer as (a: object, b: object) => number);
            } else if (undefined === this.sortTransformer || this.sortTransformer) {
                this.items.sort((a: any, b: any) => {
                    const aText = getPropertyFromItem(a, this.itemText, 'label');
                    const bText = getPropertyFromItem(b, this.itemText, 'label');

                    if (aText < bText) {
                        return -1;
                    } else if (aText > bText) {
                        return 1;
                    }

                    return 0;
                });
            }
        }

        this.finishLoading();

        // force to resize and update the position of the menu
        if (this.selectRef && this.selectRef.$refs.menu) {
            this.selectRef.$refs.menu.onResize();
        }
    }

    private getSelectValue(): any[] {
        if (!this.selectRef) {
            return [];
        }

        if (!!this.$attrs.multiple || '' === this.$attrs.multiple) {
            return this.selectRef.value || [];
        }

        return this.selectRef.value ? [this.selectRef.value] : [];
    }

    private async standardFetchRequest(event: FetchRequestDataListEvent): Promise<ListResponse> {
        if (!this.targetMetadata) {
            throw new Error('The "targetMetadata" props is required if the "fetchRequest" props is not defined');
        }

        if (!this.$store.state.metadata || !this.$store.state.metadata.metadatas[this.targetMetadata]) {
            throw new Error('The "' + this.targetMetadata + '" metadata in "targetMetadata" props is not defined');
        }

        return await this.$api.requestList(event.buildRequestConfig({
            url: '/{organization}/' + this.$store.state.metadata.metadatas[this.targetMetadata].pluralName,
        }), event.canceler);
    }

    private async onOpen(open: boolean): Promise<void> {
        if (open && (!this.isInitialized || (!this.search && this.items.length <= this.getSelectValue().length))) {
            await this.refresh();
        } else if (!open) {
            this.selectRef.$refs.input.focus();
        }

        this.$emit('open', open, this.hasError);
    }

    private async selectFirstItem(): Promise<void> {
        if (this.selectFirst && !this.isInitialized && !this.selectRef.$props.value) {
            await this.refresh();

            if (this.items.length > 0) {
                this.selectRef.setValue(this.items[0]);
            }
        }
    }

    private async refreshItemsOnInit(): Promise<void> {
        if (this.refreshOnInit && !this.isInitialized && !!this.selectRef.$props.value) {
            const selectedValue = this.selectRef.$props.value;

            if (!typeof selectedValue === 'object') {
                throw new Error('The "refreshItemsOnInit" props can only be used with returned objects');
            }

            if (Array.isArray(selectedValue)) {
                throw new Error('The "refreshItemsOnInit" props cannot be used with multiple props');
            }

            if (selectedValue[this.itemValue]) {
                this.initValue(selectedValue[this.itemValue]);
            }
        }
    }

    private updateSearchInput(value: string|null): void {
        const itemText = typeof this.itemText === 'function' ? this.itemText() : this.itemText;

        if (null !== value && value !== this.search && (!this.selectRef.value || (typeof this.selectRef.value === 'object' && value !== this.selectRef.value[itemText]))) {
            this.search = value || '';
        }
    }

    private onBlur(): void {
        if (!this.autocomplete && !this.combobox) {
            this.search = '';
        } else if (!this.$refs.select?.isMenuActive) {
            this.search = '';
        }
    }

    @Watch('search')
    private async watchSearchRequest(searchValue?: string): Promise<void> {
        if (!this.isInitialized) {
            return;
        }

        this.page = 1;
        await this.fetchData(searchValue);
    }

    @Watch('isMetadataInitialized')
    private async watchIsMetadataInitialized(initialized: boolean): Promise<void> {
        if (initialized && !!this.targetMetadata) {
            await this.selectFirstItem();
            await this.refreshItemsOnInit();
        }
    }

    @Watch('selectFirst')
    private async watchSelectFirst(value: boolean): Promise<void> {
        if (value) {
            await this.selectFirstItem();
            await this.refreshItemsOnInit();
        }
    }
}
</script>
