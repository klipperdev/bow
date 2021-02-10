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
import {mergeClassesToString} from '@klipper/bow/utils/style';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component({
    inheritAttrs: false,
})
export default class KStandardDataList extends mixins(
    SlotWrapper,
) {
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
    public associatedList!: boolean;

    @Prop({type: Boolean, default: false})
    public noMarginTop!: boolean;

    @Prop({type: Boolean, default: false})
    public noExport!: boolean;

    @Prop({type: Boolean, default: false})
    public noImport!: boolean;

    @Prop({type: Array, default: undefined})
    public exportFields!: string[]|undefined;

    @Prop({type: Function, default: () => null})
    public queryBuilderTransformer!: QueryBuilderTransformer;

    private get genListView(): boolean {
        return !this.associatedList && this.listView;
    }

    private get genQueryBuilder(): boolean {
        return this.queryBuilder;
    }

    private get genDataListProps(): Dictionary<any> {
        if (!this.associatedList) {
            return this.$attrs;
        }

        const classes = [];

        if (!this.noMarginTop) {
            classes.push('mt-5');
        }

        return Object.assign({
            'class': mergeClassesToString(this.$attrs.class, classes),
            'init-limit': 5,
            'items-per-page': [5],
            'top-on-refresh': false,
            'route-query': !!this.$attrs['route-query-prefix'],
        }, this.$attrs);
    }

    private get isExportAvailable(): boolean {
        return !!(this.$refs.dataList
            && (this.$refs.dataList as any).metadata
            && this.$store.state.metadata.metadatas[(this.$refs.dataList as any).metadata]
            && this.$store.state.metadata.metadatas[(this.$refs.dataList as any).metadata].availableActions.includes('export'))
            && !this.noExport
        ;
    }

    private get isImportAvailable(): boolean {
        return !!(this.$refs.dataList
            && (this.$refs.dataList as any).metadata
            && this.$store.state.metadata.metadatas[(this.$refs.dataList as any).metadata]
            && this.$store.state.metadata.metadatas[(this.$refs.dataList as any).metadata].availableActions.includes('import'))
            && !this.noImport
        ;
    }
}
