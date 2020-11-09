<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KUserAvatar.ts" />

<style lang="scss" src="./KUserAvatar.scss" />

<template>
    <div
        class="k-user-avatar"
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
                ></v-skeleton-loader>

                <v-skeleton-loader
                    v-if="label"
                    type="text"
                    :width="skeletonWidth"
                    class="ml-2"
                ></v-skeleton-loader>
            </div>
        </slot>

        <v-avatar
            v-else
            :id="'userAvatar_' + _uid"
            :class="imgClasses"
            :style="imgStyles"
            :size="size"
            :color="color"
            dark
        >
            <v-fade-transition
                mode="out-in"
            >
                <k-img
                    v-if="imageUrl"
                    :api-src="imageUrl"
                    mode="cover"
                >
                    <template v-slot:default="{loaded}">
                        <v-row
                            v-if="!loaded"
                            class="fill-height ma-0"
                            align="center"
                            justify="center"
                        >
                            <span
                                v-if="alias"
                                class="k-user-avatar-alias white--text"
                                :style="'font-size: ' + aliasSize + ';'"
                            >
                                {{ alias }}
                            </span>

                            <span
                                v-else-if="initial"
                                class="k-user-avatar-initial white--text"
                                :style="'font-size: ' + initialSize + ';'"
                            >
                                {{ initial }}
                            </span>

                            <v-icon
                                v-else-if="!user"
                                small
                                dark
                            >
                                fa fa-fw fa-user-slash
                            </v-icon>

                            <v-icon
                                v-else
                                small
                                dark
                            >
                                fa fa-fw fa-user
                            </v-icon>
                        </v-row>
                    </template>
                </k-img>

                <span
                    v-else-if="alias"
                    class="k-user-avatar-alias white--text"
                    :style="'font-size: ' + aliasSize + ';'"
                >
                    {{ alias }}
                </span>

                <span
                    v-else-if="initial"
                    class="k-user-avatar-initial white--text"
                    :style="'font-size: ' + initialSize + ';'"
                >
                    {{ initial }}
                </span>

                <v-icon
                    v-else-if="!user"
                    small
                    dark
                >
                    fa fa-fw fa-user-slash
                </v-icon>

                <v-icon
                    v-else
                    small
                    dark
                >
                    fa fa-fw fa-user
                </v-icon>
            </v-fade-transition>
        </v-avatar>

        <slot
            name="label"
            v-bind="$attrs"
        >
            <span
                v-if="label && !!tooltipContent"
                class="ml-2"
            >
                {{ tooltipContent }}
            </span>
        </slot>

        <v-tooltip
            :activator="'#userAvatar_' + _uid"
            :left="left"
            :right="right"
            :top="top"
            :bottom="bottom"
            :nudge-left="left ? tooltipNudge : 0"
            :nudge-right="right ? tooltipNudge : 0"
            :nudge-top="top ? tooltipNudge : 0"
            :nudge-bottom="bottom ? tooltipNudge : 0"
            :open-delay="tooltipOpenDelay"
            :disabled="tooltipDisabled"
            :transition="tooltipTransitionValue"
            :color="color"
        >
            <span>
                {{ tooltipContent }}
            </span>
        </v-tooltip>
    </div>
</template>
