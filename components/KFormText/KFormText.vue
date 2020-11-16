<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KFormText.ts" />

<template>
    <v-text-field
        ref="text"
        v-bind="$attrs"
        v-on="$listeners"
        :dense="undefined === $attrs.dense ? true : $attrs.dense"
        :filled="undefined === $attrs.filled ? true : $attrs.filled"
    >
        <template v-slot:append><slot name="append"/></template>
        <template v-slot:append-outer><slot name="append-outer"/></template>
        <template v-slot:default><slot name="default"/></template>
        <template v-slot:label><slot name="label"/></template>
        <template v-slot:message="scope"><slot name="message" v-bind="scope"/></template>
        <template v-slot:prepend><slot name="prepend"/></template>
        <template v-slot:prepend-inner><slot name="prepend-inner"/></template>
        <template v-slot:progress><slot name="progress"/></template>
    </v-text-field>
</template>
