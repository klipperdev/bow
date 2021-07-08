/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

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
