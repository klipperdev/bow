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
interface Computed {
    get self(): Vue|any;
}

export const Selfable = Vue.extend<{}, {}, Computed>({
    name: 'selfable',

    computed: {
        self(): Vue|any {
            return this;
        }
    },
});
