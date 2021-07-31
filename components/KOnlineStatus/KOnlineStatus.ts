/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {OnlineCheckable} from '@klipper/bow/mixins/OnlineCheckable';
import {Selfable} from '@klipper/bow/mixins/Selfable';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KOnlineStatus extends mixins(
    OnlineCheckable,
    Selfable,
) {
    @Prop({type: Boolean, default: true})
    public onlyOffline: boolean;
}
