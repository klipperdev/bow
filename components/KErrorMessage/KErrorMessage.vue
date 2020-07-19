<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-row align="center" justify="center">
        <k-wall-message :message="message">
            <template v-slot:icon>
                <k-lottie
                        center
                        width="90%"
                        max-width="600px"
                        :options="{animationData: iconData, loop: true}"
                ></k-lottie>
            </template>

            <template v-slot:default>
                <slot></slot>
            </template>
        </k-wall-message>
    </v-row>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import iconData from '../../assets/animations/errorIcon.json';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KErrorMessage extends Vue {
        @Prop({type: String, required: true})
        public message!: string;

        public get iconData(): object {
            return  iconData;
        }
    }
</script>
