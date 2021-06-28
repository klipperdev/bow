<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KHeading.ts" />

<style lang="scss" src="./KHeading.scss" />

<template>
    <div
        v-bind="$attrs"
        v-on="$listeners"
        :class="classes"
    >
        <slot name="default"/>
    </div>
</template>
