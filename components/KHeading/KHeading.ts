/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {Themeable} from '@klipper/bow/mixins/Themeable';
import {mixins} from 'vue-class-component';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KHeading extends mixins(
    Themeable,
) {
    private get classes(): Dictionary<boolean> {
        return {
            'k-heading': true,
            ...this.themeClasses,
        };
    }
}
