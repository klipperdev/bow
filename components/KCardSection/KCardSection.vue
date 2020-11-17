<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KCardSection.ts" />

<style lang="scss" src="./KCardSection.scss" />

<template>
    <div
        :class="classes"
    >
        <v-card-actions>
            <slot
                name="actions"
                :show="show"
            >
                <v-slide-y-transition
                    mode="out-in"
                >
                    <span
                        v-if="!!title"
                        :class="titleClasses"
                        @click="show = locked ? show : !show"
                    >
                        {{ title }}
                    </span>
                </v-slide-y-transition>
            </slot>

            <v-spacer />

            <v-scale-transition
                mode="out-in"
                origin="center center"
            >
                <v-btn
                    v-if="!locked && show"
                    key="up"
                    icon
                    x-small
                    ripple
                    @click="show = !show"
                >
                    <v-icon
                        x-small
                    >
                        fa fa-chevron-up
                    </v-icon>
                </v-btn>

                <v-btn
                    v-else-if="!locked"
                   key="down"
                   icon
                   x-small
                   ripple
                   @click="show = !show"
                >
                    <v-icon
                        x-small
                    >
                        fa fa-chevron-down
                    </v-icon>
                </v-btn>
            </v-scale-transition>
        </v-card-actions>

        <v-divider
            v-if="showDivider && show"
        />

        <v-expand-transition>
            <div
                v-show="show"
                :class="contentClasses"
            >
                <slot
                    name="default"
                    :show="show"
                />
            </div>
        </v-expand-transition>
    </div>
</template>
