/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {StandardViewItem} from '@klipper/bow/mixins/StandardViewItem';
import {mixins} from 'vue-class-component';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KStandardViewFieldPersonFullName extends mixins(
    StandardViewItem,
) {
    private getName(data: Dictionary<any>): string {
        return (
            this.$oc(data).salutation.label('') + (!!this.$oc(data).salutation('') ? ' ' : '')
            + this.$oc(data).full_name('')
        ).trim();
    }
}
