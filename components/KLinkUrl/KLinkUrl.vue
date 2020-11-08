<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KLinkUrl.ts" />

<template>
    <a
        v-if="!!src"
        v-bind="$attrs"
        v-on="$listeners"
        :href="src"
        :target="target"
    >
        <slot
            name="default"
            :src="src"
        >
            {{ src }}
        </slot>
    </a>

    <span
        v-else
    >
        {{ defaultValue }}
    </span>
</template>
