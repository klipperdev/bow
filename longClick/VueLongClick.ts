/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import _Vue from 'vue';
import {PluginObject} from 'vue';
import {LongClickOptions} from '@klipper/bow/longClick/LongClickOptions';
import {createLongClickMixin} from '@klipper/bow/longClick/mixins/longClick';

/**
 * Long click vue plugin.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default {
    install: (Vue: typeof _Vue, options?: LongClickOptions): void => {
        Vue.mixin(createLongClickMixin(options));
    },
} as PluginObject<LongClickOptions>;
