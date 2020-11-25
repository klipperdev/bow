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
    public header!: boolean;

    @Prop({type: [String]})
    public title!: string|undefined;

    @Prop({type: [String]})
    public icon!: string|undefined;

    @Prop({type: Boolean, default: false})
    public associatedList!: boolean;

    private get genListView(): boolean {
        return !this.associatedList && this.listView;
    }

    private get genDataListProps(): Dictionary<any> {
        if (!this.associatedList) {
            return this.$attrs;
        }

        return Object.assign({
            'class': mergeClassesToString(this.$attrs.class, [
                'mt-5',
            ]),
            'init-limit': 5,
            'items-per-page': [5],
            'top-on-refresh': false,
            'route-query': !!this.$attrs['route-query-prefix'],
        }, this.$attrs);
    }
}
