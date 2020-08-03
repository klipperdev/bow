/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue, {WatchHandler} from 'vue';
import {Component} from 'vue-property-decorator';
import {Dictionary} from '../generic/Dictionary';

/**
 * This mixin provides `attrs$` and `listeners$` to work around.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class BindsAttrs extends Vue {
    public attrs$: Dictionary<string> = {};

    public listeners$: Dictionary<Function|Function[]> = {};

    public created(): void {
        // Work around unwanted re-renders: https://github.com/vuejs/vue/issues/10115
        // Make sure to use `attrs$` instead of `$attrs` (confusing right?)
        this.$watch('$attrs', makeWatcher('attrs$'), { immediate: true });
        this.$watch('$listeners', makeWatcher('listeners$'), { immediate: true });
    }
}

function makeWatcher(property: string): ThisType<Vue> & WatchHandler<any> {
    return function(this: Vue, val, oldVal) {
        for (const attr in oldVal) {
            if (!Object.prototype.hasOwnProperty.call(val, attr)) {
                this.$delete(this.$data[property], attr);
            }
        }

        // tslint:disable-next-line:forin
        for (const attr in val) {
            this.$set(this.$data[property], attr, val[attr]);
        }
    };
}
