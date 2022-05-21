<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <k-card-section
        v-bind="genProps"
        v-on="$listeners"
    >
        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]="props">
            <slot :name="slotItem.original" v-bind="props"/>
        </template>
    </k-card-section>
</template>

<script lang="ts">
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {provide as RegistrableProvide} from '@klipper/bow/mixins/Registrable';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {StandardViewFieldable} from '@klipper/bow/mixins/StandardViewFieldable';
import {StandardViewItem} from '@klipper/bow/mixins/StandardViewItem';
import {StandardViewData} from '@klipper/bow/standardView/StandardViewData';
import {mixins} from 'vue-class-component';
import {Component, Prop, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KStandardViewSection extends mixins(
    StandardViewItem,
    SlotWrapper,
    RegistrableProvide('standardView'),
) {
    @Prop({type: Boolean, default: false})
    public keepClosed!: boolean;

    @Prop({type: Boolean, default: false})
    public editMode!: boolean;

    @Prop({type: Boolean, default: false})
    public vertical!: boolean;

    @Prop({type: Object})
    public value!: Dictionary<any>;

    protected standardItems: StandardViewItem[] = [];

    protected standardFields: StandardViewFieldable[] = [];

    protected get genProps(): Dictionary<any> {
        return Object.assign({
            locked: !this.keepClosed && (this.genStandardData.editMode || undefined !== this.$attrs.locked),
        }, this.$attrs);
    }

    protected get genStandardData(): StandardViewData {
        return Object.assign({}, this.standardData, {
            metadata: this.metadata || this.standardData.metadata,
            editMode: this.editMode || this.standardData.editMode,
            vertical: this.vertical || this.standardData.vertical,
            data: undefined !== this.value ? this.value : this.standardData.data,
        }) as StandardViewData;
    }

    public setStandardData(data: StandardViewData): void {
        this.standardData = data;
        this.watchStandardDataValues();
    }

    public register(standardItem: StandardViewItem): void {
        if (!this.standardItems.find((i: Vue) => i._uid === standardItem._uid)) {
            this.standardItems.push(standardItem);
        }

        if (this.isFieldableItem(standardItem)
            && !this.standardFields.find((i: Vue) => i._uid === standardItem._uid)
        ) {
            this.standardFields.push(standardItem as StandardViewFieldable);
        }

        standardItem.setStandardData(this.genStandardData);

        if (this.standardView) {
            this.standardView.register(standardItem);
        }
    }

    public unregister(standardItem: StandardViewItem): void {
        if (this.standardItems.find((i: any) => i._uid === (standardItem as any)._uid)) {
            this.standardItems = this.standardItems.filter((i: any) => i._uid !== (standardItem as any)._uid);
        }

        if (this.isFieldableItem(standardItem)) {
            if (this.standardFields.find((i: any) => i._uid === (standardItem as any)._uid)) {
                this.standardFields = this.standardFields.filter((i: any) => i._uid !== (standardItem as any)._uid);
            }
        }

        if (this.standardView) {
            this.standardView.unregister(standardItem);
        }
    }

    protected isFieldableItem(standardItem: StandardViewItem|StandardViewFieldable): boolean {
        return undefined !== (standardItem as any).name;
    }

    @Watch('standardData')
    protected watchStandardDataValues(): void {
        this.standardItems.forEach((standardItem: StandardViewItem) => {
            standardItem.setStandardData(this.genStandardData);
        });
    }
}
</script>
