<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KFormColor.ts" />

<template>
    <v-color-picker
        ref="color"
        v-bind="$attrs"
        v-on="$listeners"
        :dot-size="undefined === $attrs['dot-size'] ? 24 : $attrs['dot-size']"
        :hide-mode-switch="undefined === $attrs['hide-mode-switch'] ? true : $attrs['hide-mode-switch']"
        :mode="undefined === $attrs['mode'] ? 'hexa' : $attrs['mode']"
    />
</template>
