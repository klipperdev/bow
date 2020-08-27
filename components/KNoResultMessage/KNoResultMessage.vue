<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-row align="center" justify="center">
        <k-wall-message :message="resultMessage" v-if="!dense">
            <template v-slot:icon>
                <k-lottie
                        center
                        width="90%"
                        max-width="500px"
                        :options="{animationData: iconData, loop: false}"
                ></k-lottie>
            </template>

            <template v-slot:default>
                <slot></slot>
            </template>
        </k-wall-message>

        <div v-else class="d-flex justify-center align-center">
            <k-lottie
                center
                inline
                width="72px"
                height="72px"
                :options="{animationData: iconData, loop: false}"
            ></k-lottie>

            <span class="ml-2 text-subtitle-1">{{ resultMessage }}</span>
        </div>
    </v-row>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import iconData from '@klipper/bow/assets/animations/searchNoResult.json';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KNoResultMessage extends Vue {
        @Prop({type: String, required: false})
        public message!: string;

        @Prop({type: Boolean, default: false})
        public dense!: boolean;

        public get resultMessage(): string {
            return this.message || this.$t('no-result');
        }

        public get iconData(): object {
            return  iconData;
        }
    }
</script>
