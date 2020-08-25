<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-chip :color="$oc(choice).color(defaultColor)" dark>
        {{ $oc(choice).label(defaultLabel) }}
    </v-chip>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KChoiceChip extends Vue {
        @Prop({type: String, default: 'grey lighten-1'})
        public defaultColor!: string;

        @Prop({type: String, default: '~'})
        public defaultLabel!: string;

        @Prop({type: Object|undefined, default: undefined, required: true})
        public choice!: object|undefined;
    }
</script>
