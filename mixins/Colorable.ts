/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {isCssColor} from '@klipper/bow/utils/color';
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class Colorable extends Vue {
    @Prop({type: String, default: null})
    public color!: string|null;

    protected get backgroundColorClasses(): Dictionary<any> {
        return !this.color || isCssColor(this.color)
            ? {}
            : {
                [this.color]: true,
            };
    }

    protected get backgroundColorStyles(): Dictionary<any> {
        return !this.color || !isCssColor(this.color)
            ? {}
            : {
                'background-color': `${this.color}`,
                'border-color': `${this.color}`,
            };
    }

    protected get textColorClasses(): Dictionary<any> {
        const [colorName, colorModifier] = (this.color || '').toString().trim().split(' ', 2) as string[]|undefined[];

        return !colorName || isCssColor(colorName)
            ? {}
            : {
                [colorName + '--text']: true,
                ['text--' + colorModifier]: true,
            };
    }

    protected get textColorStyles(): Dictionary<any> {
        return !this.color || isCssColor(this.color)
            ? {}
            : {
                'color': `${this.color}`,
                'caret-color': `${this.color}`,
            };
    }
}
