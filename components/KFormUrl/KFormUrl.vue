<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <k-form-text
        ref="formText"
        v-bind="genProps"
        v-on="$listeners"
    >
        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]="props">
            <slot :name="slotItem.original" v-bind="props"/>
        </template>
    </k-form-text>
</template>

<script lang="ts">
import {formable} from '@klipper/bow/composables/mixins/formable';
import {SlotWrapper} from '@klipper/bow/composables/mixins/slotWrapper';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {RuleValidate} from '@klipper/bow/validator/Rule';
import {defineComponent} from '@vue/composition-api';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default defineComponent({
    name: 'KFormUrl',

    mixins: [
        SlotWrapper,
        formable('formText'),
    ],

    props: {
        noProtocol: {
            type: Boolean,
            default: false,
        }
    },

    computed: {
        genProps(): Dictionary<any> {
            const prependInnerIcon = this.$attrs['prepend-inner-icon'];
            const rules = Array.isArray(this.$attrs.rules) ? this.$attrs.rules as RuleValidate[] : [] as RuleValidate[];

            rules.push(this.$r('url', {withHttp: !this.noProtocol}));

            return Object.assign({
                'prepend-inner-icon': undefined !== prependInnerIcon ? prependInnerIcon : 'public',
                rules,
            }, this.$attrs);
        },
    },
});
</script>
