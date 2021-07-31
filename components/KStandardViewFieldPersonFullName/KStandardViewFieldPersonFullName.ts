/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {Selfable} from '@klipper/bow/mixins/Selfable';
import {StandardViewItem} from '@klipper/bow/mixins/StandardViewItem';
import {mixins} from 'vue-class-component';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KStandardViewFieldPersonFullName extends mixins(
    Selfable,
    StandardViewItem,
) {
    protected getName(data: Dictionary<any>): string {
        return (
            data?.salutation?.label + (!!data?.salutation ? ' ' : '')
            + data?.full_name
        ).trim();
    }
}
