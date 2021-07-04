<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KNoResultMessage.ts" />

<template>
    <div
        class="d-flex align-center justify-center"
    >
        <k-wall-message
            v-if="!dense"
            :message="resultMessage"
        >
            <template v-slot:icon>
                <k-lottie
                    center
                    width="90%"
                    max-width="500px"
                    :options="{animationData: iconData, loop: false}"
                ></k-lottie>
            </template>

            <template v-slot:default>
                <slot name="default"/>
            </template>
        </k-wall-message>

        <div
            v-else
            class="d-flex justify-center align-center"
        >
            <k-lottie
                center
                inline
                width="72px"
                height="72px"
                :options="{animationData: iconData, loop: false}"
            ></k-lottie>

            <span
                class="ml-2 text-subtitle-1"
            >
                {{ resultMessage }}
            </span>
        </div>
    </div>
</template>
