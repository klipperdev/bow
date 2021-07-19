/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Themer} from '@klipper/bow/themer/Themer';
import {ThemerClasses} from '@klipper/bow/themer/ThemerClasses';
import {Colors} from 'vuetify/lib/util/colors';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
declare module 'vue/types/vue' {
    interface Vue {
        $themer: Themer;
        $colors: Colors;
        $classes: (classes: Array<ThemerClasses|string>|ThemerClasses|string, darkClasses?: ThemerClasses|string) => ThemerClasses;
        $color: (color: Array<string|undefined>|string, darkColor?: string) => string;
    }
}
