/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue from 'vue';
import VueFormatter from '../formatter/VueFormatter';
import {Formatter} from '../formatter/Formatter';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
const formatter = new Formatter();

Vue.use(VueFormatter, formatter);

export default formatter;
