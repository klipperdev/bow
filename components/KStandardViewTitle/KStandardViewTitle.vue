<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KStandardViewTitle.ts" />

<template>
    <v-scroll-y-transition mode="out-in">
        <div
            v-if="isLoading"
            key="loading"
            class="flex-grow-1"
        >
            <slot
                name="loading"
            >
                <v-skeleton-loader
                    v-bind="skeletonLoaderPropsValue"
                ></v-skeleton-loader>
            </slot>
        </div>

        <div
            v-else
            key="title"
            :class="classes"
            v-bind="$attrs"
            v-on="$listeners"
        >
            <slot
                v-if="displayDefaultTitle"
                name="defaultTitle"
                :loading="isLoading"
                :title="genTitle"
                :defaultTitle="defaultTitle"
                :prefix="prefix"
            >
                {{ defaultTitle }}
            </slot>

            <slot
                v-else
                name="title"
                :loading="isLoading"
                :title="genTitle"
                :defaultTitle="defaultTitle"
                :prefix="prefix"
            >
                {{ prefix }}

                <slot
                    name="default"
                    :loading="isLoading"
                    :title="genTitle"
                    :defaultTitle="defaultTitle"
                    :prefix="prefix"
                >
                    {{ genTitle || defaultTitle }}
                </slot>
            </slot>
        </div>
    </v-scroll-y-transition>
</template>
