/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {inject as RegistrableInject, provide as RegistrableProvide} from '@klipper/bow/mixins/Registrable';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {mixins} from 'vue-class-component';
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component({
    inheritAttrs: false,
})
export default class KKanbanColumn extends mixins(
    SlotWrapper,
    RegistrableProvide('kanbanColumn'),
    RegistrableInject<'kanban', any>('kanban'),
) {
    @Prop({type: String})
    public label!: string;

    @Prop({type: Object})
    public contentProps!: Dictionary<any>|undefined;

    @Prop({type: String})
    public width!: string;

    @Prop({type: String})
    public spacer!: string;

    @Prop({type: Boolean, default: false})
    public disabled!: boolean;

    private cards: Vue[] = [];

    private get displayHeader(): boolean {
        return !!this.$scopedSlots.header
            || this.displayHeaderToolbar
        ;
    }

    private get displayHeaderToolbar(): boolean {
        return !!this.label
            || !!this.$scopedSlots['header-title']
            || !!this.$scopedSlots['header-actions-prepend']
            || !!this.$scopedSlots['header-actions-append']
            || this.displayHeaderToolbarMenu
        ;
    }

    private get displayHeaderToolbarMenu(): boolean {
        return !!this.$scopedSlots['header-actions-menu'];
    }

    private get displayFooter(): boolean {
        return !!this.$scopedSlots.footer
            || this.displayHeaderToolbar
        ;
    }

    private get displayFooterToolbar(): boolean {
        return !!this.$scopedSlots['footer-title']
            || !!this.$scopedSlots['footer-actions-prepend']
            || !!this.$scopedSlots['footer-actions-append']
            || this.displayFooterToolbarMenu
        ;
    }

    private get displayFooterToolbarMenu(): boolean {
        return !!this.$scopedSlots['footer-actions-menu'];
    }

    private get genStyles(): Dictionary<any> {
        return {
            width: this.width,
            maxWidth: this.width,
            marginRight: this.spacer,
        };
    }

    private get genSlotProps(): Dictionary<any> {
        return {
            label: this.label,
            displayHeader: this.displayHeader,
            displayHeaderToolbar: this.displayHeaderToolbar,
            displayFooter: this.displayFooter,
            displayFooterToolbar: this.displayFooterToolbar,
        };
    }

    public register(card: Vue): void {
        if (!this.cards.find((i: Vue) => i._uid === card._uid)) {
            this.cards.push(card);
        }
    }

    public unregister(card: Vue): void {
        if (this.cards.find((i: Vue) => i._uid === card._uid)) {
            this.cards = this.cards.filter((i: Vue) => i._uid !== card._uid);
        }
    }
}
