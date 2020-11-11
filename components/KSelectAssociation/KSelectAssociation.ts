/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {FetchRequestDataListEvent} from '@klipper/bow/http/event/FetchRequestDataListEvent';
import {FetchRequestDataListFunction} from '@klipper/bow/http/request/FetchRequestDataListFunction';
import {AjaxListContent} from '@klipper/bow/mixins/http/AjaxListContent';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {getPropertyFromItem} from '@klipper/bow/utils/object';
import {Canceler} from '@klipper/http-client/Canceler';
import {ListResponse} from '@klipper/http-client/models/responses/ListResponse';
import {FilterCondition} from '@klipper/sdk/models/filters/FilterCondition';
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
) {
    @Prop({type: Function})
    public fetchRequest!: FetchRequestDataListFunction;

    @Prop({type: Function})
    public resultTransformer!: Function;

    @Prop({type: String})
    public targetMetadata!: string;

    @Prop({type: Number, default: 100})
    public initLimit!: number;

    @Prop({type: Object})
    public filters!: FilterCondition|FilterRule;

    @Prop({type: [Sort, String, Array]})
    public sort!: Sort|Sort[]|string|string[];

    @Prop({type: Array, default: () => []})
    public fields!: string[];

    @Prop({type: Boolean, default: false})
    public selectFirst!: boolean;

    @Ref('select')
    private readonly selectRef!: Vue|any;

    private get isMetadataInitialized(): boolean {
        return undefined === this.$store.state.metadata || this.$store.state.metadata.initialized;
    }

    private get selectAttrs(): Dictionary<any> {
        const multiple = !!this.$attrs.multiple || '' === this.$attrs.multiple;

        return Object.assign({
            'loading': this.loading,
            'dense': true,
            'clearable': true,
            'chips': multiple,
            'small-chips': multiple,
            'deletable-chips': multiple,
            'return-object': true,
            'item-value': this.itemValue,
            'item-text': this.itemText,
            'placeholder': this.$t('select.placeholder'),
            'items': this.items,
        }, this.$attrs);
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
        const fields = [];

        if (typeof this.itemValue === 'string') {
            fields.push(this.itemValue);
        }

        if (typeof this.itemText === 'string') {
            fields.push(this.itemText);
        }

        return [
            ...fields,
            ...this.fields,
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
        }
    }

    public reset(): void {
        this.selectRef.reset();
        this.search = '';
        this.pages = -1;
        this.items = [];
    }

    public async previousPage(): Promise<void> {
        if (this.page > 1) {
            this.page--;
            await this.refresh();
        }
    }

    public async nextPage(): Promise<void> {
        if (this.page < this.pages) {
            this.page++;
            await this.refresh();
        }
    }

    public async fetchDataRequest(canceler: Canceler, searchValue: string): Promise<ListResponse<any>> {
        const event = new FetchRequestDataListEvent();
        event.page = this.page;
        event.limit = this.limit;
        event.pages = this.pages;
        event.total = this.total;
        event.search = searchValue ? searchValue : null;
        event.canceler = canceler;
        event.filters = this.filters || null;
        event.sort = this.sort;

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
            if (valueItems.indexOf(item[itemValue]) < 0) {
                this.items.push(item);
                valueInjected = true;
            }
        });

        if (valueInjected) {
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

        this.finishLoading();

        // force to resize and update the position of the menu
        this.selectRef.$refs.menu.onResize();
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

        return await this.$api.requestList({
            method: 'GET',
            url: '/{organization}/' + this.$store.state.metadata.metadatas[this.targetMetadata].pluralName,
            limit: event.limit,
            page: event.page,
            search: event.search || undefined,
            sort: event.sort,
            filter: event.filters || undefined,
            fields: this.requestFields,
        }, event.canceler);
    }

    private async onOpen(open: boolean): Promise<void> {
        if (open && !this.isInitialized) {
            await this.refresh();
        } else if (!open) {
            this.selectRef.$refs.input.focus();
        }
    }

    private async selectFirstItem(): Promise<void> {
        if (this.selectFirst && !this.isInitialized && !this.selectRef.$props.value) {
            await this.refresh();

            if (this.items.length > 0) {
                this.selectRef.setValue(this.items[0]);
            }
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
        }
    }
}
