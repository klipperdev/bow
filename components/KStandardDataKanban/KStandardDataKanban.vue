<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <k-data-kanban
        ref="dataKanban"
        v-bind="genDataKanbanProps"
        v-on="$listeners"
    >
        <template v-slot:prepend="kanbanProps">
            <k-standard-header
                v-if="initialized && header"
                class="flex-grow-0"
            >
                <template v-slot:header>
                    <slot name="header-prepend" v-bind="kanbanProps"/>

                    <k-list-view
                        v-if="genListView"
                        :type="metadata"
                        :route-query="$refs.dataKanban.routeQuery"
                        :route-query-prefix="$refs.dataKanban.routeQueryPrefix"
                        @change="$refs.dataKanban.refreshToFirstPage"
                    />

                    <k-standard-view-title-icon
                        v-if="!!icon"
                        :icon="icon"
                        :icon-size="24"
                        color="accent"
                    />

                    <k-standard-view-title
                        v-if="!!title"
                        :title="title"
                        disable-loading
                        flex-grow=""
                    />

                    <v-chip
                        v-if="null !== kanbanProps.total && undefined !== kanbanProps.total && (!!genListView || !!title)"
                        small
                        outlined
                        class="ml-2"
                    >
                        {{ $number(kanbanProps.total, 0) }}
                    </v-chip>

                    <k-query-builder
                        v-if="genQueryBuilder && !!$refs.dataKanban && !!metadata"
                        class="ml-2"
                        :type="metadata"
                        :route-query="$refs.dataKanban.routeQuery"
                        :route-query-prefix="$refs.dataKanban.routeQueryPrefix"
                        :filter-transformer="queryBuilderTransformer"
                        @change="$refs.dataKanban.refreshToFirstPage"
                    >
                        <template v-for="slotItem in getSlotItems('query-builder')" v-slot:[slotItem.target]="props">
                            <slot :name="slotItem.original" v-bind="props"/>
                        </template>
                    </k-query-builder>
                </template>

                <template v-slot:actions>
                    <slot
                        name="header-actions-prepend"
                        v-bind="kanbanProps"
                    />

                    <k-standard-header-button
                        icon="refresh"
                        color="primary"
                        text
                        :loading="kanbanProps.loading"
                        @click="kanbanProps.refresh"
                    />

                    <slot
                        name="header-actions-append-refresh"
                        v-bind="kanbanProps"
                    />

                    <slot
                        v-if="$refs.dataKanban && !!metadata"
                        name="header-export-actions"
                        :isExportAvailable="isExportAvailable"
                        :metadata="metadata"
                        :filter="$refs.dataKanban.requestFilters"
                        :search="kanbanProps.search"
                        :fields="exportFields"
                    >
                        <k-standard-header-button-export
                            v-if="isExportAvailable"
                            :metadata="metadata"
                            :filter="$refs.dataKanban.requestFilters"
                            :search="kanbanProps.search"
                            :fields="exportFields"
                        />
                    </slot>

                    <slot
                        v-if="$refs.dataKanban && !!metadata"
                        name="header-import-actions"
                        :isImportAvailable="isImportAvailable"
                        :metadata="metadata"
                    >
                        <k-standard-header-button-import
                            v-if="isImportAvailable"
                            :metadata="metadata"
                        />
                    </slot>

                    <slot
                        name="header-actions"
                        v-bind="kanbanProps"
                    />
                </template>
            </k-standard-header>
        </template>

        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]="props">
            <slot :name="slotItem.original" v-bind="props"/>
        </template>
    </k-data-kanban>
</template>

<script lang="ts">
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {QueryBuilderTransformer} from '@klipper/bow/queryBuilder/QueryBuilderTransformer';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component({
    inheritAttrs: false,
})
export default class KStandardDataKanban extends mixins(
    SlotWrapper,
) {
    @Prop({type: String})
    public metadata!: string;

    @Prop({type: Boolean, default: true})
    public listView!: boolean;

    @Prop({type: Boolean, default: true})
    public queryBuilder!: boolean;

    @Prop({type: Boolean, default: true})
    public header!: boolean;

    @Prop({type: [String]})
    public title!: string|undefined;

    @Prop({type: [String]})
    public icon!: string|undefined;

    @Prop({type: Boolean, default: false})
    public noExport!: boolean;

    @Prop({type: Boolean, default: false})
    public noImport!: boolean;

    @Prop({type: Array, default: undefined})
    public exportFields!: string[]|undefined;

    @Prop({type: Function, default: () => null})
    public queryBuilderTransformer!: QueryBuilderTransformer;

    /**
     * Use to fix the empty header on the first initialization.
     */
    private initialized: boolean = false;

    private get genListView(): boolean {
        return !!this.$refs.dataKanban
            && !!this.metadata
            && this.listView
            ;
    }

    private get genQueryBuilder(): boolean {
        return this.queryBuilder;
    }

    private get genDataKanbanProps(): Dictionary<any> {
        return Object.assign({
            'route-query': true,
        }, this.$attrs);
    }

    private get isExportAvailable(): boolean {
        return !!(this.$refs.dataKanban
            && !!this.metadata
            && this.$store.state.metadata.metadatas[this.metadata]
            && this.$store.state.metadata.metadatas[this.metadata].availableActions.includes('export'))
            && !this.noExport
        ;
    }

    private get isImportAvailable(): boolean {
        return !!(this.$refs.dataKanban
            && !!this.metadata
            && this.$store.state.metadata.metadatas[this.metadata]
            && this.$store.state.metadata.metadatas[this.metadata].availableActions.includes('import'))
            && !this.noImport
        ;
    }

    public mounted(): void {
        this.initialized = true;
    }
}
</script>
