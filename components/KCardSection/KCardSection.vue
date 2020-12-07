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
        <v-divider
            v-if="showDivider"
        />

        <v-card-actions v-if="!(!title && locked)">
            <slot
                name="actions"
                :show="show"
            >
                <span
                    v-if="!!title"
                    :class="titleClasses"
                    @click="show = locked ? show : !show"
                >
                    {{ title }}
                </span>
            </slot>

            <v-spacer />

            <v-btn
                icon
                x-small
                ripple
                color="primary"
                @click="show = !show"
            >
                <v-icon
                    v-if="!locked && show"
                    key="up"
                    x-small
                >
                    fa-chevron-up
                </v-icon>

                <v-icon
                    v-else-if="!locked"
                    key="down"
                    x-small
                >
                    fa-chevron-down
                </v-icon>
            </v-btn>
        </v-card-actions>

        <div
            v-show="show"
            :class="contentClasses"
        >
            <slot
                name="default"
                :show="show"
            />
        </div>
    </div>
</template>
