/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class Elevatable extends Vue {
    @Prop({type: [Number, String], default: null})
    public elevation?: number;

    public get computedElevation(): string|number|null {
        return this.elevation || null;
    }

    public get elevationClasses(): Record<string, boolean> {
        if (!this.computedElevation) {
            return {};
        }

        return {
            [`elevation-${this.computedElevation}`]: true,
        };
    }
}
