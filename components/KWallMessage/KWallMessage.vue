<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchinok-tooltip>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KWallMessage.ts" />

<template>
    <div class="text-align-center">
        <slot
            name="icon"
        ></slot>

        <h2
            v-if="message || $slots.message"
            :class="classes"
        >
            {{ message }}

            <slot
                name="message"
            ></slot>
        </h2>

        <slot
            name="default"
        ></slot>
    </div>
</template>
