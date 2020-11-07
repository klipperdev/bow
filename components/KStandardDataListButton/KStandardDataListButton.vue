<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-btn v-bind="genButtonProps" v-on="$listeners">
        <v-icon small>
            <slot name="default">{{ icon }}</slot>
        </v-icon>
    </v-btn>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KStandardDataListButton extends Vue {
        @Prop({type: String, default: undefined})
        public icon!: string;

        public get genButtonProps(): Record<string, any> {
            return Object.assign({
                'color': this.$color('accent', 'accent lighten-1'),
                depressed: true,
                ripple: true,
                rounded: true,
                small: true,
            }, this.$attrs);
        }
    }
</script>
