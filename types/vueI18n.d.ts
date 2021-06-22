/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import 'vue';
import {VueI18n} from 'vue-i18n/types';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
declare module 'vue/types/vue' {
    interface Vue {
        readonly $i18n: typeof VueI18n.prototype;
        $t: typeof VueI18n.prototype.t;
        $tc: typeof VueI18n.prototype.tc;
        $te: typeof VueI18n.prototype.te;
        $d: typeof VueI18n.prototype.d;
        $n: typeof VueI18n.prototype.n;
    }
}
