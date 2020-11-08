<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KTooltip.ts" />

<style lang="scss" src="./KTooltip.scss" />

<template>
    <div
        class="k-tooltip--wrapper"
        @click="hover = true"
        @mouseover="hover = true"
        @mouseleave="hover = false"
    >
        <transition
            :name="transition"
        >
            <span
                v-if="hover"
                :class="classes"
            >
                <slot
                    name="tooltip"
                >
                    {{ message }}
                </slot>
            </span>
        </transition>

        <slot
            name="default"
        ></slot>
    </div>
</template>
