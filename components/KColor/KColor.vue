<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-avatar
        v-if="!!value"
        v-bind="genProps"
        v-on="$listeners"
        :color="value"
    >
        <slot name="default"/>
    </v-avatar>

    <k-text
        v-else
        :value="defaultValue"
    />
</template>

<script lang="ts">
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KColor extends Vue {
    @Prop({type: [String, Number]})
    public value!: string|number;

    @Prop({type: String, default: '~'})
    public defaultValue!: string;

    private get genProps(): Dictionary<any> {
        return Object.assign({
            size: undefined === this.$attrs.size ? 24 : undefined,
        }, this.$attrs);
    }
}
</script>
