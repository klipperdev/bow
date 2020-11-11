/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {StandardViewAssociationable} from '@klipper/bow/mixins/StandardViewAssociationable';
import {mixins} from 'vue-class-component';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KStandardViewFieldAssociationChoice extends mixins(
    StandardViewAssociationable,
    SlotWrapper,
) {
    protected get genAssociationChoiceEditProps(): Dictionary<any> {
        const type = !!this.associationMetadata
                && !!this.associationMetadata.inputConfig.criteria
                && this.associationMetadata.inputConfig.criteria.type
            ? this.associationMetadata.inputConfig.criteria.type
            : '';

        return Object.assign({
            type,
        }, this.genAssociationEditProps);
    }
}
