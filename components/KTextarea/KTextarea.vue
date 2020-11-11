<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KTextarea.ts" />

<template>
    <span
        v-bind="$attrs"
        v-on="$listeners"
        :class="classes"
        :style="styles"
        v-html="genValue"
    >
        <slot name="default"/>
    </span>
</template>
