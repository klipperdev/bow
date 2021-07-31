<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KChoiceChip.ts" />

<template>
    <v-chip
        v-if="!!choice"
        :color="self.$oc(genChoice).color(genDefaultColor)"
        dark
        v-bind="$attrs"
        v-on="$listeners"
        :class="genClasses"
    >
        <slot
            name="default"
            v-bind="genSlotProps"
        >
            <v-icon
                v-if="self.$oc(genChoice).icon()"
                left
                dark
                :small="!$attrs.small"
                :x-small="$attrs.small || $attrs['x-small']"
            >
                {{ $oc(genChoice).icon() }}
            </v-icon>

            {{ genLabel }}
        </slot>
    </v-chip>

    <span
        v-else
    >
        {{ defaultLabel }}
    </span>
</template>
