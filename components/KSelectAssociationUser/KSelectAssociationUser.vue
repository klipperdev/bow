<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <k-select-association
        ref="select"
        v-bind="selectAttrs"
        v-on="$listeners"
    >
        <template v-slot:selection="{item}">
            <k-user-avatar
                :size="genSelectedAvatarSize"
                vertical-adjust
                label
                :user="item"
            />
        </template>

        <template v-slot:item="{item}">
            <k-user-avatar
                :size="genListAvatarSize"
                vertical-adjust
                label
                :user="item"
            />
        </template>

        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]="props">
            <slot :name="slotItem.original" v-bind="props"/>
        </template>
    </k-select-association>
</template>

<script lang="ts">
import {ajaxSelectFormable} from '@klipper/bow/composables/mixins/formable';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {ListResponse} from '@klipper/http-client/models/responses/ListResponse';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component({
    inheritAttrs: false,
})
export default class KSelectAssociationUser extends mixins(
    SlotWrapper,
    ajaxSelectFormable('select'),
) {
    private static resultTransformer(res: ListResponse<any>): void {
        const values = res.results;
        res.results = [];

        values.forEach((value) => {
            res.results.push(value.user);
        });
    }

    @Prop({type: Number, default: 30})
    public selectedAvatarSize!: number;

    @Prop({type: Number, default: 32})
    public listAvatarSize!: number;

    private get isDense(): boolean {
        return !!this.$attrs.dense || '' === this.$attrs.dense;
    }

    private get genSelectedAvatarSize(): number {
        return this.isDense ? Math.round(0.8 * this.selectedAvatarSize) : this.selectedAvatarSize;
    }

    private get genListAvatarSize(): number {
        return this.isDense ? Math.round(0.8 * this.listAvatarSize) : this.listAvatarSize;
    }

    private get selectAttrs(): Dictionary<any> {
        const fields = this.$attrs.fields ?? [];

        ['user', 'user.image_url', 'user.username'].forEach((field: string) => {
            if (!fields.includes(field)) {
                fields.push(field);
            }
        });

        return Object.assign({}, this.$attrs, {
            'target-metadata': 'organization_user',
            'item-text': 'full_name',
            'item-value': 'id',
            'fields': fields,
            'resultTransformer': KSelectAssociationUser.resultTransformer,
            'placeholder': this.$t('select.placeholder'),
        });
    }
}
</script>
