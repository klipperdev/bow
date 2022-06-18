<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <k-col-label
        v-bind="genColLabelProps"
        v-on="genColLabelListeners"
    >
        <template v-slot:read>
            <span v-if="isMultiple && isEmpty">{{ defaultValue }}</span>

            <k-link-association
                v-else-if="!isMultiple"
                ref="read"
                v-bind="genViewProps"
                v-on="genViewListeners"
                :value="fieldValue"
                :default-value="defaultValue"
                :route="genRouteName"
                :route-identifier="routeIdentifier"
                :field-identifier="itemValue"
                :field-label="itemText"
            >
                <template v-for="slotItem in getSlotItems('view')" v-slot:[slotItem.target]="props">
                    <slot :name="slotItem.original" v-bind="props"/>
                </template>
            </k-link-association>

            <k-link-association
                v-else
                ref="read"
                v-bind="genViewProps"
                v-on="genViewListeners"
                :value="item"
                :default-value="defaultValue"
                :route="!route && fallbackRouteUseName ? name : route"
                :route-identifier="routeIdentifier"
                :field-identifier="itemValue"
                :field-label="itemText"
                v-for="item in fieldValue"
                :key="typeof item === 'object' ? item[itemValue] : item"
            >
                <template v-for="slotItem in getSlotItems('view')" v-slot:[slotItem.target]="props">
                    <slot :name="slotItem.original" v-bind="props"/>
                </template>
            </k-link-association>
        </template>

        <template v-slot:edit>
            <k-form-association
                ref="edit"
                v-model="fieldValue"
                v-bind="genAssociationEditProps"
                v-on="genEditListeners"
                filled
            >
                <template v-for="slotItem in getSlotItems('form')" v-slot:[slotItem.target]="props">
                    <slot :name="slotItem.original" v-bind="props"/>
                </template>
            </k-form-association>
        </template>

        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]="props">
            <slot :name="slotItem.original" v-bind="props"/>
        </template>
    </k-col-label>
</template>

<script lang="ts">
import {ajaxSelectFormable} from '@klipper/bow/composables/mixins/formable';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
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
    ajaxSelectFormable('edit'),
) {
    @Prop({type: String, default: undefined})
    public route!: string;

    @Prop({type: String, default: undefined})
    public routeIdentifier!: string;

    @Prop({type: Boolean, default: true})
    public fallbackRouteUseName!: boolean;

    @Prop({type: Boolean, default: false})
    public self!: boolean;

    @Prop({type: Boolean, default: false})
    public chip!: boolean;

    @Prop({type: Object, default: undefined})
    public chipProps!: Dictionary<any>;

    protected get genRouteName(): string {
        const name = this.self && this.metadataName ? this.metadataName : this.name;

        return !this.route && this.fallbackRouteUseName && name ? name.replace('_', '-') : this.route;
    }

    protected get itemText(): string {
        if (!!this.$attrs['item-text']) {
            return this.$attrs['item-text'];
        }

        const targetMetadata = this.self && this.metadataName ? this.metadataName : this.targetMetadata;

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
            return this.standardData.data || undefined;
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

    protected get genViewProps(): Dictionary<any> {
        return Object.assign({
            'chip': this.chip,
            'chip-props': this.chipProps,
        }, this.viewProps || {});
    }
}
</script>
