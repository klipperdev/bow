<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-icon v-bind="$attrs"
            v-on="$listeners"
            class="mr-2"
            :size="iconSize"
            :color="$color(color, darkColor)"
    >
        {{ icon }}
    </v-icon>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KStandardViewTitleIcon extends Vue {
        @Prop({type: String, required: true})
        public icon: boolean;

        @Prop({type: Number, default: 30})
        public iconSize: number;

        @Prop({type: String, default: 'primary'})
        public color: string;

        @Prop({type: String, default: 'primary lighten-3'})
        public darkColor: string;
    }
</script>
