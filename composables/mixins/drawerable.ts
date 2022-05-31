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
    get drawer(): boolean;
}

export const Drawerable = Vue.extend<{}, {}, Computed>({
    name: 'drawerable',

    computed: {
        drawer: {
            get(): boolean {
                return this.$store?.state?.drawer?.temporary || false
                    ? this.$store?.state?.drawer?.temporaryShow || false
                    : this.$store?.state?.drawer?.show || false;
            },
            set(value) {
                if (this.$store) {
                    this.$store.commit('drawer/toggle', value as boolean);
                }
            },
        },
    },
});
