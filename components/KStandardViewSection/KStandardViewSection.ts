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
import {StandardViewItem} from '@klipper/bow/mixins/StandardViewItem';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KStandardViewSection extends mixins(
    StandardViewItem,
    SlotWrapper,
) {
    @Prop({type: Boolean, default: false})
    public keepClosed!: boolean;

    protected get genProps(): Dictionary<any> {
        return Object.assign({
            locked: !this.keepClosed && (this.standardData.editMode || undefined !== this.$attrs.locked),
        }, this.$attrs);
    }
}
