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
import Vue, {PropType} from 'vue';
import {DefaultData} from 'vue/types/options';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
interface Computed {
    get backgroundColorClasses(): any;
    get backgroundColorStyles(): Dictionary<any>;
    get textColorClasses(): Dictionary<any>;
    get textColorStyles(): Dictionary<any>;
}

interface Props {
    color: string|null;
}

export const Colorable = Vue.extend<{}, {}, Computed, Props>({
    name: 'colorable',

    props: {
        color: {
            type: String as PropType<string|null>,
            default: null,
        }
    },

    computed: {
        backgroundColorClasses():Dictionary<any> {
            return !this.color || isCssColor(this.color)
                ? {}
                : {
                    [this.color]: true,
                };
        },

        backgroundColorStyles(): Dictionary<any> {
            return !this.color || !isCssColor(this.color)
                ? {}
                : {
                    'background-color': `${this.color}`,
                    'border-color': `${this.color}`,
                };
        },

        textColorClasses(): Dictionary<any> {
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

        textColorStyles(): Dictionary<any> {
            return !this.color || isCssColor(this.color)
                ? {}
                : {
                    'color': `${this.color}`,
                    'caret-color': `${this.color}`,
                };
        },
    },
});
