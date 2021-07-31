/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue from 'vue';
import {Store} from 'vuex';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    store?: Store<any>;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $store: Store<any>;
  }
}
