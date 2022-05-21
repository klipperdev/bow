<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div class="text-align-center">
        <slot
            name="icon"
        ></slot>

        <h2
            v-if="message || $slots.message"
            :class="classes"
        >
            {{ message }}

            <slot
                name="message"
            ></slot>
        </h2>

        <slot
            name="default"
        ></slot>
    </div>
</template>

<script lang="ts">
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KWallMessage extends Vue {
    @Prop({type: String, required: false})
    public message!: string;

    private get classes(): Dictionary<boolean> {
        return {
            'mt-2': true,
            'mb-5': true,
            'text--secondary': this.$store && this.$store && this.$store.state.darkMode
                ? this.$store.state.darkMode.enabled
                : false,
        };
    }
}
</script>
