<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div>
        <v-card-actions>
            <slot name="actions">
                <v-slide-y-transition mode="out-in">
                    <span class="text-subtitle-2" v-if="!!title">{{ title }}</span>
                </v-slide-y-transition>
            </slot>

            <v-spacer></v-spacer>

            <v-scale-transition mode="out-in" origin="center center">
                <v-btn v-if="show"
                       key="up"
                       icon
                       small
                       ripple
                       @click="show = !show"
                >
                    <v-icon small>fa fa-chevron-up</v-icon>
                </v-btn>

                <v-btn v-else
                       key="down"
                       icon
                       small
                       ripple
                       @click="show = !show"
                >
                    <v-icon small>fa fa-chevron-down</v-icon>
                </v-btn>
            </v-scale-transition>
        </v-card-actions>

        <v-expand-transition>
            <div v-show="show">
                <v-divider></v-divider>
                <slot name="default"></slot>
            </div>
        </v-expand-transition>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KCardSection extends Vue {
        @Prop({type: String, default: null})
        public title!: string;

        private show: boolean = false;
    }
</script>
