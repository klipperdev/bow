/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {DrawerItem} from '@klipper/bow/drawer/DrawerItem';
import {RawLocation} from 'vue-router';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class TextDrawerItem implements DrawerItem {
    public text: string|((vue: Vue) => string);

    public translatable: boolean|((vue: Vue) => boolean);

    public icon?: string|((vue: Vue) => string);

    public color?: string|string[]|((vue: Vue) => string|string[]);

    public dense?: boolean|((vue: Vue) => boolean);

    public route?: RawLocation|((vue: Vue) => RawLocation);

    public exact: boolean|((vue: Vue) => boolean) = false;

    public constructor(text: string|((vue: Vue) => string) = '', translatable: boolean|((vue: Vue) => boolean) = true) {
        this.text = text;
        this.translatable = translatable;
    }

    public setText(text: string|((vue: Vue) => string), translatable?: boolean|((vue: Vue) => boolean)): this {
        this.text = text;

        if (undefined !== translatable) {
            this.setTranslatable(translatable);
        }

        return this;
    }

    public setTranslatable(translatable: boolean|((vue: Vue) => boolean)): this {
        this.translatable = translatable;

        return this;
    }

    public setIcon(icon?: string|((vue: Vue) => string)): this {
        this.icon = icon;

        return this;
    }

    public setColor(color?: string|string[]|((vue: Vue) => string|string[])): this {
        this.color = color;

        return this;
    }

    public setDense(dense: boolean|((vue: Vue) => boolean)): this {
        this.dense = dense;

        return this;
    }

    public setRoute(route?: RawLocation|((vue: Vue) => RawLocation)): this {
        this.route = route;

        return this;
    }

    public setExact(exact: boolean|((vue: Vue) => boolean)): this {
        this.exact = exact;

        return this;
    }
}
