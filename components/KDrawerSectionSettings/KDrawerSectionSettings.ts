/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Component, Watch} from 'vue-property-decorator';
import {mixins} from 'vue-class-component';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KDrawerSectionSettings extends mixins(SlotWrapper) {
    private tooltipDisabled: boolean = false;

    private get mini(): boolean {
        return this.$store && this.$store.state.drawer ? this.$store.state.drawer.mini : false;
    }

    public mounted(): void {
        this.watchMini(this.mini);
    }

    @Watch('mini')
    private watchMini(mini: boolean): void {
        this.tooltipDisabled = !mini;
    }
}
