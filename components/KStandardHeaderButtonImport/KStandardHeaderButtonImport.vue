<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KStandardHeaderButtonImport.ts" />

<template>
    <k-import-action
        v-bind="genButtonProps"
        v-on="$listeners"
    />
</template>
