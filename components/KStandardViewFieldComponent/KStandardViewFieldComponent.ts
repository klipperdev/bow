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
import {StandardViewFieldable} from '@klipper/bow/mixins/StandardViewFieldable';
import {mixins} from 'vue-class-component';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KStandardViewFieldComponent extends mixins(
    StandardViewFieldable,
    SlotWrapper,
) {
    protected get genViewProps(): Dictionary<any> {
        return Object.assign({
            standardData: this.standardData,
            metadata: this.metadataName,
            objectMetadata: this.objectMetadata,
            fieldMetadata: this.fieldMetadata,
            associationMetadata: this.associationMetadata,
            propertyPath: this.genPropertyPath,
            defaultValue: this.defaultValue,
            fieldValue: this.fieldValue,
            isEmpty: this.isEmpty,
            isRequired: this.isRequired,
            isTranslatable: this.isTranslatable,
            isReadonly: this.isReadonly,
            rules: this.genRules,
        }, this.viewProps);
    }
}
