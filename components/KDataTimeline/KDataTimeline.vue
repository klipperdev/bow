<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div class="k-data-timeline">
        <slot
            name="prepend"
            v-bind="genSlotProps"
        />

        <v-card v-bind="genCardProps">
            <v-fade-transition>
                <v-progress-linear
                    v-if="loading"
                    indeterminate
                    absolute
                />
            </v-fade-transition>

            <k-loading
                v-if="loading && -1 === pages"
                :size="28"
                :width="3"
            />

            <slot
                v-else-if="0 === items.length"
                name="no-items"
                v-bind="genSlotProps"
            >
                <k-no-result-message
                    dense
                    class="my-1"
                />
            </slot>

            <v-timeline
                v-else
                v-bind="genProps"
                v-on="$listeners"
                align-top
                dense
            >
                <v-timeline-item v-for="item in items" :key="getItemKey(item)">
                    <template v-slot:default>
                        <slot
                            name="item"
                            v-bind="getItemSlotProps(item)"
                        />
                    </template>

                    <template v-slot:icon>
                        <slot
                            name="item.icon"
                            v-bind="getItemSlotProps(item)"
                        />
                    </template>

                    <template v-slot:opposite>
                        <slot
                            name="item.opposite"
                            v-bind="getItemSlotProps(item)"
                        />
                    </template>
                </v-timeline-item>

                <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]="props">
                    <slot :name="slotItem.original" v-bind="props"/>
                </template>

                <v-fade-transition mode="out-in">
                    <div
                        v-if="hasPagination"
                        class="k-data-timeline--pagination d-flex align-center pa-1"
                    >
                        <v-spacer/>

                        <v-btn
                            small
                            rounded
                            ripple
                            icon
                            :disabled="page <= 1"
                            @click="previousPage"
                        >
                            <v-icon>
                                chevron_left
                            </v-icon>
                        </v-btn>

                        <span class="ml-2 text-caption text--secondary">
                            {{ page }}
                        </span>

                        <span class="mx-2 text-caption text--secondary">/</span>

                        <span class="mr-2 text-caption text--secondary">
                            {{ pages > 0 ? pages : 1 }}
                        </span>

                        <v-btn
                            small
                            rounded
                            ripple
                            icon
                            :disabled="page >= pages"
                            @click="nextPage"
                        >
                            <v-icon>
                                chevron_right
                            </v-icon>
                        </v-btn>

                        <v-spacer/>
                    </div>
                </v-fade-transition>
            </v-timeline>
        </v-card>

        <slot
            name="append"
            v-bind="genSlotProps"
        />
    </div>
</template>

<style lang="scss" src="./KDataTimeline.scss" />

<script lang="ts">
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

    @Prop({type: Array, default: () => []})
    public searchFields!: string[];

    @Prop({type: Boolean, default: false})
    public viewsDetails!: boolean;

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

    public mounted(): void {
        this.refresh().then();
    }

    public async refresh(showSnackbar: boolean = false, topOnRefresh: boolean = false): Promise<void> {
        await this.fetchData(this.search ? this.search : undefined, this.useSnackbar || showSnackbar, this.topOnRefresh || topOnRefresh);
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
        event.searchFields = this.searchFields.length > 0 ? this.searchFields : null;
        event.viewsDetails = this.viewsDetails ? true : null;

        return await this.fetchRequest(event);
    }

    protected async hookBeforeFetchDataRequestList(topOnRefresh: boolean = false): Promise<void> {
        if (this.topOnRefresh || topOnRefresh) {
            await this.$vuetify.goTo(0);
        }
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
</script>
