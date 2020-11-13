/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Themeable} from '@klipper/bow/mixins/Themeable';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KChoiceChip extends mixins(
    Themeable,
) {
    @Prop({type: String, default: undefined})
    public defaultColor!: string;

    @Prop({type: String, default: '~'})
    public defaultLabel!: string;

    @Prop({type: [Object, String]})
    public choice!: object|string|undefined;

    private get genDefaultColor(): string {
        if (this.defaultColor) {
            return this.defaultColor;
        }

        return this.isDark ? 'blue-grey darken-1' : 'blue-grey lighten-3';
    }

    private get genLabel(): string {
        return typeof this.choice === 'string' ? this.choice : this.$oc<any>(this.choice).label();
    }
}
