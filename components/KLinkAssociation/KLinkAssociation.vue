<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KLinkAssociation.ts" />

<template>
    <router-link
        v-if="!!genTo"
        v-bind="$attrs"
        v-on="$listeners"
        :to="genTo"
    >
        <k-text :value="genLabel"/>
    </router-link>

    <k-text
        v-else
        v-bind="$attrs"
        v-on="$listeners"
        :value="genLabel"
    />
</template>
