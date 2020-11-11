/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {StandardViewAssociationable} from '@klipper/bow/mixins/StandardViewAssociationable';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KStandardViewFieldAssociation extends mixins(
    StandardViewAssociationable,
    SlotWrapper,
) {
    @Prop({type: String, default: undefined})
    public route!: string;

    @Prop({type: String, default: undefined})
    public routeIdentifier!: string;

    @Prop({type: Boolean, default: true})
    public fallbackRouteUseName!: boolean;
}
