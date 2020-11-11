/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {DarkModeModuleState} from '@klipper/bow/stores/darkMode/DarkModeModuleState';
import {Themer} from '@klipper/bow/themer/Themer';
import {ThemerClasses} from '@klipper/bow/themer/ThemerClasses';
import _Vue, {PluginObject} from 'vue';
import {Store} from 'vuex';

/**
 * Themer vue plugin.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default class VueThemer implements PluginObject<never> {
    private readonly store: Store<DarkModeModuleState>;

    constructor(router: Store<DarkModeModuleState>) {
        this.store = router;
    }

    public install(Vue: typeof _Vue): void {
        const themer = new Themer(this.store);
        Vue.prototype.$themer = themer;

        Vue.prototype.$classes = (classes: Array<ThemerClasses|string>|ThemerClasses|string, darkClasses?: ThemerClasses|string) => {
            if (Array.isArray(classes)) {
                darkClasses = undefined !== classes[1] ? classes[1] : undefined;
                classes = undefined !== classes[0] ? classes[0] : '';
            }

            return themer.classes(classes, darkClasses);
        };

        Vue.prototype.$color = (color: Array<string|undefined>|string, darkColor?: string) => {
            if (Array.isArray(color)) {
                darkColor = undefined !== color[1] ? color[1] : undefined;
                color = undefined !== color[0] ? color[0] : '';
            }

            return themer.color(color, darkColor);
        };
    }
}
