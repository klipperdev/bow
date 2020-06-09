/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
Component.registerHooks([
  'metaInfo',
  'beforeRouteEnter',
  'beforeRouteUpdate',
  'beforeRouteLeave',
]);
