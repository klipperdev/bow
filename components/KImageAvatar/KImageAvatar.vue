<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KImageAvatar.ts" />

<style lang="scss" src="./KImageAvatar.scss" />

<template>
    <div
        class="k-image-avatar"
    >
        <slot
            v-if="loading"
            name="loading"
        >
            <div
                class="k-user-avatar-skeleton-loader"
            >
                <v-skeleton-loader
                    type="avatar"
                    :width="size"
                    :height="size"
                    :class="imgClasses"
                    :style="imgStyles"
                />
            </div>
        </slot>

        <v-avatar
            v-else
            v-bind="genAvatarProps"
            v-on="$listeners"
            :class="imgClasses"
            :style="imgStyles"
            :size="size"
            :color="color"
        >
            <k-img
                :api-src="imageUrl"
                :key="imageUrl"
                :mode="mode"
            >
                <template v-slot:placeholder>
                    <slot
                        name="placeholder"
                        :size="genIconSize"
                        :src="imageUrl"
                    >
                        <v-icon
                            :size="genIconSize"
                            :color="colorIcon"
                        >
                            {{ icon }}
                        </v-icon>
                    </slot>
                </template>

                <template v-slot:default="{loaded}">
                    <slot
                        v-if="!loaded"
                        name="placeholder"
                        :size="genIconSize"
                        :src="imageUrl"
                    >
                        <v-icon
                            :size="genIconSize"
                            :color="colorIcon"
                        >
                            {{ icon }}
                        </v-icon>
                    </slot>
                </template>
            </k-img>
        </v-avatar>
    </div>
</template>
