/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {StandardViewData} from '@klipper/bow/standardView/StandardViewData';
import Vue from 'vue';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface StandardViewItem extends Vue {
    setStandardData: (data: StandardViewData) => void;
}
