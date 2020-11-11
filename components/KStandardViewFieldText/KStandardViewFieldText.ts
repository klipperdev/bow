/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {Component} from 'vue-property-decorator';
import {mixins} from 'vue-class-component';
import {StandardViewFieldable} from '@klipper/bow/mixins/StandardViewFieldable';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KStandardFieldText extends mixins(
    StandardViewFieldable,
    SlotWrapper,
) {
}
