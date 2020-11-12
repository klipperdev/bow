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
    @Prop({type: String})
    public value!: string;

    @Prop({type: String, default: '~'})
    public defaultValue!: string;

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
}
