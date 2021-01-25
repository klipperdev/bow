<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KImg.ts" />

<style lang="scss" src="./KImg.scss" />

<template>
    <div
        :class="classes"
    >
        <v-img
            v-bind="$attrs"
            :src="lazyData"
            :key="apiSrc"
        >
            <template v-slot:placeholder>
                <slot name="placeholder" :loaded="isLoaded"/>
            </template>

            <template v-slot:default>
                <slot
                    name="default"
                    :loaded="isLoaded"
                />
            </template>
        </v-img>
    </div>
</template>
