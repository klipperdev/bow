<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <a
        v-if="!!src"
        v-bind="$attrs"
        v-on="$listeners"
        :href="src"
        :target="target"
    >
        <slot
            name="default"
            :src="src"
            :label="label"
        >
            {{ label || src }}
        </slot>
    </a>

    <span
        v-else
    >
        {{ defaultValue }}
    </span>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KLinkUrl extends Vue {
    @Prop({type: String})
    public src!: string|undefined;

    @Prop({type: String})
    public label!: string|undefined;

    @Prop({type: String, default: '~'})
    public defaultValue!: string;

    @Prop({type: String, default: '_blank'})
    public target!: string;
}
</script>
