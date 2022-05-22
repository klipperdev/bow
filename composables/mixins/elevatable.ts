/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import Vue, {PropType} from 'vue';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
interface Props {
    elevation: Number|String|null,
}

interface Computed {
    get computedElevation(): string|number|null;
    get elevationClasses(): Dictionary<boolean>;
}

export const Elevatable = Vue.extend<{}, {}, Computed, Props>({
    name: 'elevatable',

    props: {
        elevation: {
            type: [Number, String] as PropType<Number|String|null>,
            default: null,
        },
    },

    computed: {
        computedElevation(): string|number|null {
            return this.elevation || null;
        },

        elevationClasses(): Dictionary<boolean> {
            if (!this.computedElevation) {
                return {};
            }

            return {
                [`elevation-${this.computedElevation}`]: true,
            };
        },
    },
});
