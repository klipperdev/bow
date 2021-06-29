/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {StandardMasterComponent} from '@klipper/bow/mixins/StandardMasterComponent';
import {StandardViewTabbable} from '@klipper/bow/mixins/StandardViewTabbable';
import {mixins} from 'vue-class-component';
import {Component, Ref} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KTabbedStandardView extends mixins(
    StandardMasterComponent,
    StandardViewTabbable,
) {
    @Ref('tabs')
    protected tabsRef: Vue|any;

    protected get displayCreate(): boolean {
        return this.isCreate && !!this.$scopedSlots.create;
    }

    private get bindSlotData(): any {
        return Object.assign(this.genSlotProps, this.genTabbableBindSlotData);
    }
}
