<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KKanban.ts" />

<style lang="scss" src="./KKanban.scss" />

<template>
    <div
        class="k-kanban"
        v-bind="$attrs"
        v-on="$listeners"
    >
        <slot
            name="prepend"
            v-bind="genSlotProps"
        />

        <div
            class="k-kanban__content"
            v-bind="contentProps"
        >
            <slot
                name="cards"
                v-bind="genSlotProps"
            />

            <slot
                name="default"
                v-bind="genSlotProps"
            />
        </div>

        <slot
            name="append"
            v-bind="genSlotProps"
        />
    </div>
</template>
