/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {DrawerItem} from './DrawerItem';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class HeadingDrawerItem implements DrawerItem {
    public heading: string;

    public translatable: boolean;

    public constructor(heading: string, translatable: boolean = true) {
        this.heading = heading;
        this.translatable = translatable;
    }

    public setHeading(heading: string): this {
        this.heading = heading;

        return this;
    }

    public setTranslatable(translatable: boolean): this {
        this.translatable = translatable;

        return this;
    }
}
