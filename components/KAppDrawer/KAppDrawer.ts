/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {DividerDrawerItem} from '@klipper/bow/drawer/DividerDrawerItem';
import {DrawerItem} from '@klipper/bow/drawer/DrawerItem';
import {HeadingDrawerItem} from '@klipper/bow/drawer/HeadingDrawerItem';
import {TextDrawerItem} from '@klipper/bow/drawer/TextDrawerItem';
import {Selfable} from '@klipper/bow/mixins/Selfable';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {mixins} from 'vue-class-component';
import {Component, Prop, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KAppDrawer extends mixins(
    Selfable,
    SlotWrapper,
) {
    @Prop({type: Array})
    public items!: DrawerItem[] | HeadingDrawerItem[] | DividerDrawerItem[] | TextDrawerItem[];

    @Prop({type: String, default: null})
    public itemKey!: string;

    private tooltipDisabled: boolean = false;

    private get itemKeyResult(): string {
        return this.itemKey || JSON.stringify(this.items);
    }

    private get mini(): boolean {
        return this.$store && this.$store.state.drawer ? this.$store.state.drawer.mini : false;
    }

    private set mini(value) {
        if (this.$store) {
            this.$store.commit('drawer/toggleMini', value as boolean);
        }
    }

    private get drawer(): boolean {
        return this.$store && this.$store.state.drawer ? this.$store.state.drawer.show : false;
    }

    private set drawer(value) {
        if (this.$store) {
            this.$store.commit('drawer/toggle', value as boolean);
        }
    }

    public mounted(): void {
        this.watchDrawerMini(this.mini);
    }

    protected eventClick(callable?: Function): void {
        if (callable) {
            callable();
        }
    }

    private getValue(value: any|Function): any {
        return typeof value === 'function' ? value(this) : value;
    }

    @Watch('mini')
    private watchDrawerMini(mini: boolean): void {
        this.tooltipDisabled = !mini;
    }
}
