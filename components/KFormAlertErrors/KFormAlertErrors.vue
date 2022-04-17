<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KFormAlertErrors.ts" />

<template>
    <form-alert-errors
        v-bind="$attrs"
        v-on="$listeners"
    >
        <template v-slot:child="{childErrors}">
            <form-alert-errors
                :errors="childErrors"
            />
        </template>
    </form-alert-errors>
</template>
