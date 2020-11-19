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
export default class KStandardViewSectionSystem extends mixins(
    StandardViewItem,
    SlotWrapper,
) {
    @Prop({type: Boolean, default: true})
    public keepClosed!: boolean;

    protected get genProps(): Dictionary<any> {
        const props = Object.assign({
            locked: !this.keepClosed && (this.standardData.editMode || undefined !== this.$attrs.locked),
            loading: this.standardData.loading,
            metadata: this.metadataName,
            data: this.standardData.data,
        }, this.$attrs) as Dictionary<any>;

        if (!!this.objectMetadata
                && undefined === this.$attrs['user-track']
                && !this.objectMetadata.associations.created_by
                && !this.objectMetadata.associations.updated_by) {
            props['user-track'] = false;
        }

        return props;
    }
}
