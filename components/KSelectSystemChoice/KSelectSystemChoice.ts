/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {SystemChoice} from '@klipper/bow/metadata/SystemChoice';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {mixins} from 'vue-class-component';
import {Component, Prop, Ref} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component({
    inheritAttrs: false,
})
export default class KSelectSystemChoice extends mixins(
    SlotWrapper,
) {
    @Prop({type: String, required: true})
    public type!: string;

    @Prop({type: Boolean, default: undefined})
    public selectFirst!: boolean;

    @Ref('select')
    private readonly selectRef!: Vue|any;

    private search: string = '';

    private get items(): SystemChoice[] {
        const choices = this.$store.state.metadata.initialized && this.$store.state.metadata.systemChoices[this.type]
            ? this.$store.state.metadata.systemChoices[this.type]
            : [];

        if (!this.search) {
            return choices;
        }

        return choices.filter((choice: SystemChoice) => {
            return choice.label.toLocaleLowerCase(this.$i18n.locale).includes(this.search.toLocaleLowerCase(this.$i18n.locale));
        });
    }

    private get selectAttrs(): Dictionary<any> {
        return Object.assign({
            'clearable': true,
            'chips': this.isMultiple,
            'small-chips': this.isMultiple,
            'deletable-chips': this.isMultiple,
            'item-value': 'value',
            'item-text': 'label',
            'placeholder': this.$t('select.placeholder'),
            'items': this.items,
        }, this.$attrs);
    }

    private get isMultiple(): boolean {
        return !!this.$attrs.multiple || '' === this.$attrs.multiple;
    }

    public mounted(): void {
        this.$watch(() => this.selectRef.$refs.menu.isActive, this.onOpen);

        if (this.selectFirst && this.items.length > 0 && !this.selectRef.$props.value) {
            this.selectRef.setValue(this.isMultiple ? [this.items[0].value] : this.items[0].value);
        }
    }

    private async onOpen(open: boolean): Promise<void> {
        if (!open) {
            this.selectRef.$refs.input.focus();
        }
    }
}
