/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {RawLocation} from 'vue-router';
import {DrawerItem} from '@klipper/bow/drawer/DrawerItem';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class TextDrawerItem implements DrawerItem {
    public text: string;

    public translatable: boolean;

    public icon?: string;

    public color?: string|string[];

    public dense?: boolean;

    public route?: RawLocation;

    public constructor(text: string, translatable: boolean = true) {
        this.text = text;
        this.translatable = translatable;
    }

    public setText(text: string): this {
        this.text = text;

        return this;
    }

    public setTranslatable(translatable: boolean): this {
        this.translatable = translatable;

        return this;
    }

    public setIcon(icon?: string): this {
        this.icon = icon;

        return this;
    }

    public setColor(color?: string|string[]): this {
        this.color = color;

        return this;
    }

    public setDense(dense: boolean): this {
        this.dense = dense;

        return this;
    }

    public setRoute(route?: RawLocation): this {
        this.route = route;

        return this;
    }
}
