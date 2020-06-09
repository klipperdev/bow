/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue from 'vue';
import Router, {RawLocation, Route} from 'vue-router';

/**
 * Add the default component in the current route if it is not defined.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function addDefaultToolbarComponentGuard(router: Router, name: string, component: any): void {
    router.beforeEach(async (to: Route, from: Route,
                             next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) => {
        to.matched.forEach((record) => {
            if (undefined === record.components[name]) {
                record.components.toolbar = component as any;
            }
        });

        next();
    });
}
