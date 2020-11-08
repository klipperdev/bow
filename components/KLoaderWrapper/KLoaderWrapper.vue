<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KLoaderWrapper.ts" />

<template>
    <div
        v-bind="$attrs"
        v-on="$listeners"
    >
        <slot
            name="default"
            :loading="loading"
        />
    </div>
</template>
