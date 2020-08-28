/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Location} from 'vue-router';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class Klipper {
    public readonly name: string;

    public readonly badgeLight: any;

    public readonly badgeDark: any;

    public readonly allowUserContext: boolean;

    public readonly userContextRedirectRoute?: Location;

    public readonly itemsPerPage: number[];

    public readonly defaultItemPerPage: number;

    public constructor(
        name: string,
        badgeLight: any,
        badgeDark: any,
        allowUserContext: boolean,
        userContextRedirectRoute?: Location,
        itemsPerPage: number[] = [10, 20, 50, 100],
        defaultItemPerPage: number = 20,
    ) {
        this.name = name;
        this.badgeLight = badgeLight;
        this.badgeDark = badgeDark;
        this.allowUserContext = allowUserContext;
        this.userContextRedirectRoute = userContextRedirectRoute;
        this.itemsPerPage = itemsPerPage;
        this.defaultItemPerPage = defaultItemPerPage;
    }
}
