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
import {mergeClassesToString} from '@klipper/bow/utils/style';
import {Canceler} from '@klipper/http-client/Canceler';
import {ListResponse} from '@klipper/http-client/models/responses/ListResponse';
import {FilterCondition} from '@klipper/sdk/models/filters/FilterCondition';
import {FilterRule} from '@klipper/sdk/models/filters/FilterRule';
import {Sort} from '@klipper/sdk/requests/Sort';
import {mixins} from 'vue-class-component';
import {Component, Prop, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component({
    inheritAttrs: false,
})
export default class KDataTimeline extends mixins(
    AjaxListContent,
    SlotWrapper,
) {
    @Prop({type: Function, required: true})
    public fetchRequest: FetchRequestDataListFunction;

    @Prop({type: Number})
    public initLimit!: number;

    @Prop({type: Boolean, default: false})
    public topOnRefresh!: boolean;

    @Prop({type: Object, default: undefined})
    public filters!: FilterRule|FilterCondition|undefined;

    @Prop({type: [Object, Array, String], default: undefined})
    public sort!: Sort|Sort[]|string|string[]|undefined;

    @Prop({type: Boolean, default: false})
    public useSnackbar!: boolean;

    @Prop({type: String, default: 'id'})
    public itemKey: string;

    @Prop({type: Object, default: () => {}})
    public cardProps!: Dictionary<any>;

    protected get classes(): Dictionary<boolean> {
        return {
            'pr-3': true,
            'pb-3': true,
            'fill-height': true,
        };
    }

    private get genProps(): Dictionary<any> {
        return {
            class: this.classes,
        };
    }

    private get genCardProps(): Dictionary<any> {
        return Object.assign({
            class: mergeClassesToString(this.cardProps ? this.cardProps.class : '', [
                'flex-column',
            ]),
        }, this.cardProps);
    }

    private get genSlotProps(): Dictionary<any> {
        return {
            loading: this.loading,
            items: this.items,
            total: this.total,
            page: this.page,
            pages: this.pages,
            refresh: this.refresh,
            search: this.search,
            previousError: this.previousError,
        };
    }

    public async created(): Promise<void> {
        if (undefined !== this.initLimit) {
            this.limit = this.initLimit;
        }
    }

    public async mounted(): Promise<void> {
        await this.refresh();
    }

    public async refresh(): Promise<void> {
        await this.fetchData(this.search ? this.search : undefined, this.useSnackbar);
        this.finishLoading();
    }

    protected async fetchDataRequest(canceler: Canceler, searchValue?: string): Promise<ListResponse<object>> {
        this.headers = this.$attrs.headers as any || [];
        const event = new FetchRequestDataListEvent();
        event.page = this.page;
        event.limit = this.limit;
        event.pages = this.pages;
        event.total = this.total;
        event.canceler = canceler;
        event.sort = this.sort;
        event.filters = this.filters || null;
        event.search = searchValue || null;

        if (this.topOnRefresh) {
            this.$vuetify.goTo(0);
        }

        return await this.fetchRequest(event);
    }

    protected hookAfterFetchDataRequest(): void {
        // Disable the default hook after fetch data request
    }

    private getItemKey(item: Dictionary<any>): string {
        return getPropertyFromItem(item, this.itemKey, '');
    }

    private getItemSlotProps(item: Dictionary<any>): Dictionary<any> {
        return Object.assign({
            item,
        }, this.genSlotProps);
    }

    @Watch('search')
    private async searchRequest(searchValue?: string): Promise<void> {
        if (!this.isInitialized) {
            return;
        }

        this.page = 1;
        await this.fetchData(searchValue);
        this.finishLoading();
    }
}
