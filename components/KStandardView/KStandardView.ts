/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {StandardComponentActionable} from '@klipper/bow/mixins/StandardComponentActionable';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KStandardView extends mixins(
    StandardComponentActionable,
) {
    @Prop({type: Boolean, default: true})
    public editModeKeepList!: boolean;

    private get displayLists(): boolean {
        return !this.isCreate && (!this.editMode || (this.editMode && this.editModeKeepList));
    }

    protected get bindSlotData(): any {
        return Object.assign({
            showError: this.showError,
            displayLists: this.displayLists,
        }, this.genSlotProps);
    }
}
