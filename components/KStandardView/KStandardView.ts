/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Selfable} from '@klipper/bow/mixins/Selfable';
import {StandardComponentActionable} from '@klipper/bow/mixins/StandardComponentActionable';
import {StandardViewTabbable} from '@klipper/bow/mixins/StandardViewTabbable';
import {mixins} from 'vue-class-component';
import {Component, Prop, Ref, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KStandardView extends mixins(
    Selfable,
    StandardComponentActionable,
    StandardViewTabbable,
) {
    @Prop({type: Boolean, default: false})
    public loader!: boolean;

    @Prop({type: Boolean, default: true})
    public editModeKeepList!: boolean;

    @Prop({type: Boolean, default: false})
    public tabbed!: boolean;

    @Prop({type: Boolean, default: false})
    public containerFluid!: boolean;

    @Prop({type: String, default: 'details'})
    public tabName!: string;

    @Prop({type: String, default() {
        return this.$t('details');
    }})
    public tabLabel!: string;

    @Ref('tabs')
    declare protected tabsRef: Vue|any;

    private get displayLists(): boolean {
        return !this.isCreate && (!this.editMode || (this.editMode && this.editModeKeepList));
    }

    private get showError(): boolean {
        return (this.loader && !this.data)
            || (this.loader && !!this.previousError);
    }

    private get bindSlotData(): any {
        return Object.assign({
            showError: this.showError,
            displayLists: this.displayLists,
        }, this.genTabbableBindSlotData, this.genSlotProps);
    }

    @Watch('tabbed', {immediate: true})
    protected watchTabbed(tabbed: boolean): void {
        if (!tabbed && null === this.tab) {
            this.setTabIndex(0);
        }
    }
}
