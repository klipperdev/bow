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
import Vue, {ComponentOptions} from 'vue';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export const Colorable: ComponentOptions<Vue|any> = {
    name: 'colorable',

    props: {
        color: {
            type: String,
            default: null,
        }
    },

    computed: {
        backgroundColorClasses: function () {
            return !this.color || isCssColor(this.color)
                ? {}
                : {
                    [this.color]: true,
                };
        },

        backgroundColorStyles: function (): Dictionary<any> {
            return !this.color || !isCssColor(this.color)
                ? {}
                : {
                    'background-color': `${this.color}`,
                    'border-color': `${this.color}`,
                };
        },

        textColorClasses: function (): Dictionary<any> {
            const [colorName, colorModifier] = (this.color || '').toString().trim().split(' ', 2) as string[]|undefined[];
            const res = {} as Dictionary<boolean>;

            if (colorName && !isCssColor(colorName)) {
                res[colorName + '--text'] = true;

                if (colorModifier) {
                    res['text--' + colorModifier] = true;
                }
            }

            return res;
        },

        textColorStyles: function (): Dictionary<any> {
            return !this.color || isCssColor(this.color)
                ? {}
                : {
                    'color': `${this.color}`,
                    'caret-color': `${this.color}`,
                };
        },
    },
};
