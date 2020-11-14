/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {DrawerItem} from '@klipper/bow/drawer/DrawerItem';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class HeadingDrawerItem implements DrawerItem {
    public heading: string|((vue: Vue) => string);

    public translatable: boolean|((vue: Vue) => boolean);

    public constructor(heading: string|((vue: Vue) => string) = '', translatable: boolean|((vue: Vue) => boolean) = true) {
        this.heading = heading;
        this.translatable = translatable;
    }

    public setHeading(heading: string|((vue: Vue) => string), translatable?: boolean|((vue: Vue) => boolean)): this {
        this.heading = heading;

        if (undefined !== translatable) {
            this.setTranslatable(translatable);
        }

        return this;
    }

    public setTranslatable(translatable: boolean|((vue: Vue) => boolean)): this {
        this.translatable = translatable;

        return this;
    }
}
