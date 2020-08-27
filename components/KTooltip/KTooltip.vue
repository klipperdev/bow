<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div class="k-tooltip--wrapper"
         @click="hover = true"
         @mouseover="hover = true"
         @mouseleave="hover = false"
    >
        <transition :name="transition">
            <span :class="classes" v-if="hover"><slot name="tooltip">{{ message }}</slot></span>
        </transition>
        <slot name="default"></slot>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import '@klipper/bow/components/KTooltip/KTooltip.scss';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KTooltip extends Vue {
        @Prop({type: String, default: 'fade'})
        public transition: string;

        @Prop({type: String, default: 'top'})
        public position: string;

        @Prop({type: String, default: '.'})
        public message: string;

        public hover: boolean = false;

        public get classes(): object {
            return {
                'k-tooltip': true,
                'k-tooltip--top': this.position === 'top',
                'k-tooltip--bottom': this.position === 'bottom',
                'k-tooltip--left': this.position === 'left',
                'k-tooltip--right': this.position === 'right',
            };
        }
    }
</script>
