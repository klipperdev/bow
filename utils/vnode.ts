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
 * Generate the reference name based on the reference name of the current component.
 *
 * If the current component has a reference name, the new reference name is the name
 * prefixed with the reference name of the current component separated with an enderscore.
 *
 * If the current component ha not a reference name, the new reference name is the name
 * suffixed with the _guid of the current component separated with an enderscore.
 *
 * @param {Vue}    self   The Vue instance
 * @param {string} [name] The new reference name
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function genSubRefName(self: Vue, name: string): string {
    return self?.$vnode?.data?.ref
        ? self?.$vnode?.data?.ref + '_' + name
        : name + '_' + self._uid
    ;
}
