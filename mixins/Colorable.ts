/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';
import {VNodeData} from 'vue/types/vnode';
import {isCssColor} from '../utils/color';
import {consoleError} from '../utils/console';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class Colorable extends Vue {
    @Prop({type: String, default: null})
    public color!: string|null;

    public setBackgroundColor(color?: string|false, data: VNodeData = {}): VNodeData {
        if (typeof data.style === 'string') {
            // istanbul ignore next
            consoleError('style must be an object', this);
            // istanbul ignore next
            return data;
        }
        if (typeof data.class === 'string') {
            // istanbul ignore next
            consoleError('class must be an object', this);
            // istanbul ignore next
            return data;
        }
        if (isCssColor(color)) {
            data.style = {
                ...data.style as object,
                'background-color': `${color}`,
                'border-color': `${color}`,
            };
        } else if (color) {
            data.class = {
                ...data.class,
                [color]: true,
            };
        }

        return data;
    }

    public setTextColor(color?: string|false, data: VNodeData = {}): VNodeData {
        if (typeof data.style === 'string') {
            // istanbul ignore next
            consoleError('style must be an object', this);
            // istanbul ignore next
            return data;
        }
        if (typeof data.class === 'string') {
            // istanbul ignore next
            consoleError('class must be an object', this);
            // istanbul ignore next
            return data;
        }
        if (isCssColor(color)) {
            data.style = {
                ...data.style as object,
                'color': `${color}`,
                'caret-color': `${color}`,
            };
        } else if (color) {
            const [colorName, colorModifier] = color.toString().trim().split(' ', 2) as string[]|undefined[];
            data.class = {
                ...data.class,
                [colorName + '--text']: true,
            };

            if (colorModifier) {
                data.class['text--' + colorModifier] = true;
            }
        }
        return data;
    }
}
