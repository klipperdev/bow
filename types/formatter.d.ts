/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Formatter} from '../formatter/Formatter';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
declare module 'vue/types/vue' {
    interface Vue {
        $formatter: Formatter;
        $fd: (value?: string, format?: string) => string|undefined;
        $ft: (value?: string, format?: string) => string|undefined;
        $fdt: (value?: string, format?: string) => string|undefined;
    }
}
