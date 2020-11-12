<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KText.ts" />

<template>
    <span
        v-bind="$attrs"
        v-on="$listeners"
        :class="classes"
        :style="styles"
        v-html="value || defaultValue"
    >
        <slot name="default"/>
    </span>
</template>
