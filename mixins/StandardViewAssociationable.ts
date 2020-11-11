/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {StandardViewFieldable} from '@klipper/bow/mixins/StandardViewFieldable';
import {mixins} from 'vue-class-component';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class StandardViewAssociationable<V = any> extends mixins(
    StandardViewFieldable,
) {
    protected get genAssociationEditProps(): Dictionary<any> {
        return Object.assign({
            'multiple': this.isMultiple,
            'target-metadata': this.targetMetadata,
            'item-text': this.itemText,
        }, this.genEditProps);
    }

    protected get isRequired(): boolean {
        if (undefined !== this.required) {
            return this.required;
        }

        return !!this.associationMetadata && this.associationMetadata.required;
    }

    protected get isReadonly(): boolean {
        if (undefined !== this.readonly) {
            return this.readonly;
        }

        return !!this.associationMetadata && this.associationMetadata.readOnly;
    }

    protected get isMultiple(): boolean {
        return !!this.associationMetadata && ['one-to-many', 'many-to-many'].includes(this.associationMetadata.type);
    }

    protected get targetMetadata(): string {
        return !!this.associationMetadata ? this.associationMetadata.target : this.name;
    }

    protected get itemText(): string {
        if (!!this.targetMetadata) {
            const targetObjectMetadata = this.getObjectMetadata(this.targetMetadata);

            if (!!targetObjectMetadata && !!targetObjectMetadata.fieldLabel) {
                return targetObjectMetadata.fieldLabel;
            }
        }

        return this.itemValue;
    }

    protected get itemValue(): string {
        if (!!this.targetMetadata) {
            const targetObjectMetadata = this.getObjectMetadata(this.targetMetadata);

            if (!!targetObjectMetadata && !!targetObjectMetadata.fieldIdentifier) {
                return targetObjectMetadata.fieldIdentifier;
            }
        }

        return 'id';
    }
}
