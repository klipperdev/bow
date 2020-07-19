<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchinok-tooltip>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div class="text-align-center">
        <slot name="icon"></slot>
        <h2 :class="classes" v-if="message || $slots.message">
            {{ message }}
            <slot name="message"></slot>
        </h2>
        <slot></slot>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    /**
     * @author François Pluchino <francois.pluchinok-tooltip>
     */
    @Component({
        components: {},
    })
    export default class KWallMessage extends Vue {
        @Prop({type: String, required: false})
        public message!: string;

        public get classes(): object {
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
