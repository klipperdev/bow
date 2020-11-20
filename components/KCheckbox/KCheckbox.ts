/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {Colorable} from '@klipper/bow/mixins/Colorable';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KCheckbox extends mixins(
    Colorable,
) {
    @Prop({type: String, default: 'primary'})
    public checkedColor!: string|null;

    @Prop({type: String, default: 'grey-blue'})
    public uncheckedColor!: string|null;

    @Prop({type: Boolean, default: false})
    public value!: boolean;

    @Prop({type: String, default: 'check_box'})
    public checkedIcon!: string;

    @Prop({type: String, default: 'check_box_outline_blank'})
    public uncheckedIcon!: string;

    private get classes(): object {
        return {
            'k-checkbox': true,
            'mt-n1': true,
            ...this.textColorClasses,
        };
    }

    private get styles(): object {
        return {
            ...this.textColorStyles,
        };
    }

    private get genIcon(): string {
        return this.value ? this.checkedIcon : this.uncheckedIcon;
    }

    private get genProps(): Dictionary<any> {
        return Object.assign({
            class: this.classes,
            style: this.styles,
            color: this.value ? this.checkedColor : this.uncheckedColor,
        }, this.$attrs);
    }
}
