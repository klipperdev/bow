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
import {getPropertyFromItem, setReactiveDeepValue} from '@klipper/bow/utils/object';
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

    @Prop({type: Boolean, default: false})
    public self!: boolean;

    protected get genRouteName(): string {
        const name = this.self && (this.metadata || this.standardData.metadata) ? (this.metadata || this.standardData.metadata) : this.name;

        return !this.route && this.fallbackRouteUseName && name ? name.replace('_', '-') : this.route;
    }

    protected get itemText(): string {
        const targetMetadata = this.self ? (this.metadata || this.standardData.metadata) : this.targetMetadata;

        if (!!targetMetadata) {
            const targetObjectMetadata = this.getObjectMetadata(targetMetadata);

            if (!!targetObjectMetadata && !!targetObjectMetadata.fieldLabel) {
                return targetObjectMetadata.fieldLabel;
            }
        }

        return this.itemValue;
    }

    protected get fieldValue(): any {
        if (this.self) {
            return this.standardData.data  || undefined;
        }

        return this.standardData.data ? getPropertyFromItem(this.standardData.data, this.genPropertyPath) : undefined;
    }

    protected set fieldValue(value: any) {
        if (this.self) {
            if (typeof this.standardData.data === 'object' && typeof value === 'object') {
                this.standardData.data = value;
            }
        } else if (typeof this.standardData.data === 'object') {
            setReactiveDeepValue(this.standardData.data, this.genPropertyPath, value);
        }
    }
}
