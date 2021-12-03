/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Colorable} from '@klipper/bow/mixins/Colorable';
import {Themeable} from '@klipper/bow/mixins/Themeable';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KRichTextarea extends mixins(
    Colorable,
    Themeable,
) {
    @Prop({type: [String, Number]})
    public value!: string|number;

    @Prop({type: String, default: '~'})
    public defaultValue!: string;

    private get classes(): object {
        return {
            'k-rich-textarea': true,
            ...this.themeClasses,
            ...this.textColorClasses,
        };
    }

    private get styles(): object {
        return {
            ...this.textColorStyles,
        };
    }

    private get genValue(): string|number|undefined {
        if (this.value) {
            return this.value;
        }

        return this.defaultValue;
    }
}
