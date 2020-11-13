<!--
This file is part of the Runr package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KSwipeItem.ts" />

<style lang="scss" src="./KSwipeItem.scss" />

<template>
    <div
        :disabled="disabled"
        :class="classes"
        v-touch="{move: onDragMove, end: onDragEnd}"
    >
        <div
            ref="leftActions"
            class="k-swipe-item-actions left"
        >
            <slot
                name="action-left"
                v-bind="slotProps"
            ></slot>
        </div>

        <div
            ref="rightActions"
            class="k-swipe-item-actions right"
        >
            <slot
                name="action-right"
                v-bind="slotProps"
            ></slot>
        </div>

        <div
            ref="content"
            :class="contentClasses"
        >
            <slot
                name="default"
                v-bind="slotProps"
            ></slot>
        </div>
    </div>
</template>
