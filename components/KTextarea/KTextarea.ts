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
export default class KTextarea extends mixins(
    Colorable,
    Themeable,
) {
    @Prop({type: String})
    public value!: string;

    private get classes(): object {
        return {
            'k-textarea': true,
            ...this.themeClasses,
            ...this.textColorClasses,
        };
    }

    private get styles(): object {
        return {
            ...this.textColorStyles,
        };
    }

    private get genValue(): string|undefined {
        if (this.value) {
            return this.value.replace(/(?:\r\n|\r|\n)/g, '<br />');
        }

        return undefined;
    }
}