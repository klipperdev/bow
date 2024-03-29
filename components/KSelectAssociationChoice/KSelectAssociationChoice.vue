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
    </k-select-association>
</template>

<script lang="ts">
import {ajaxSelectFormable} from '@klipper/bow/composables/mixins/formable';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {mergeFilters} from '@klipper/sdk/utils/filter';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component({
    inheritAttrs: false,
})
export default class KSelectAssociationChoice extends mixins(
    ajaxSelectFormable('select'),
) {
    @Prop({type: String, default: undefined})
    public type!: string;

    private get selectAttrs(): Dictionary<any> {
        return Object.assign({
            'target-metadata': 'choice',
            'item-text': 'label',
            'item-value': 'value',
            'fields': ['position', 'color'],
            'search-fields': ['label'],
            'sort': ['position:asc', 'value:asc'],
            'placeholder': this.$t('select.placeholder'),
        }, this.$attrs, {
            filters: mergeFilters(
                'AND',
                {field: 'type', operator: 'equal', value: this.type},
                typeof this.$attrs.filters === 'object' ? this.$attrs.filters : null,
            ),
        });
    }
}
</script>
