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
export default class KText extends mixins(
    Colorable,
    Themeable,
) {
    @Prop({type: [String, Number]})
    public value!: string|number;

    @Prop({type: String, default: '~'})
    public defaultValue!: string;

    @Prop({type: String})
    public prepend!: string;

    @Prop({type: String})
    public append!: string;

    private get classes(): object {
        return {
            'k-text': true,
            ...this.themeClasses,
            ...this.textColorClasses,
        };
    }

    private get styles(): object {
        return {
            ...this.textColorStyles,
        };
    }

    private get genValue(): string|number {
        let value = this.value;

        if (undefined !== value && null !== value) {
            if (this.prepend) {
                value = this.prepend + ' ' + value;
            }

            if (this.append) {
                value += ' ' + this.append;
            }
        }

        return value;
    }
}
