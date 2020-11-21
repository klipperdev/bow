<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KLinkEmail.ts" />

<template>
    <span
        class="k-link-phone"
    >
        <a
            v-if="!!src"
            v-bind="$attrs"
            v-on="$listeners"
            :href="emailLink"
        >
            <slot
                name="default"
                :src="src"
                :href="emailLink"
            >
                {{ src }}
            </slot>
        </a>

        <slot
            v-if="!!src && icon"
            name="icon"
            :src="src"
            :href="emailLink"
            :iconColor="iconColor"
        >
            <k-btn-helper
                :href="emailLink"
                :color="iconColor"
                icon="fa-fw fa-envelope"
            />
        </slot>

        <span
            v-if="!src"
        >
            {{ defaultValue }}
        </span>
    </span>
</template>
