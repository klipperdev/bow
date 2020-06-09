/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue from 'vue';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface LongClickVue extends Vue {
    $longClickDestroy?: () => void;
    $longClickTimeout?: number;
    $longClickEnabled?: boolean;
}
