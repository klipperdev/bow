/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue, {ComponentOptions} from 'vue';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export const Selfable: ComponentOptions<Vue|any> = {
    name: 'selfable',

    computed: {
        self(): Vue|any {
            return this;
        }
    },
};
