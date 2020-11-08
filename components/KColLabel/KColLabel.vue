<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KColLabel.ts" />

<style lang="scss" src="./KColLabel.scss" />

<template>
    <v-col
        v-bind="colPropsValue"
    >
        <v-row
            :class="rowClasses"
        >
            <v-col
                v-if="!hideLabel"
                cols="12"
                md="4"
                :class="labelClasses"
            >
                <v-badge
                    bordered
                    color="error"
                    dot
                    :value="editMode && editLabelRequired"
                >
                    <slot
                        name="label"
                    >
                        <span>
                            {{ label }}
                        </span>
                    </slot>
                </v-badge>

                <v-badge
                    bottom
                    :content="badgeTranslateContent"
                    :icon="badgeTranslateIcon"
                    color="accent"
                    offset-x="8"
                    offset-y="-4"
                    :value="editMode && hasBadgeTranslate"
                    class="k-col-label-badge-trans"
                ></v-badge>
            </v-col>

            <v-scroll-y-transition
                mode="out-in"
                origin="left top"
            >
                <v-col
                    v-if="isLoading"
                    key="loading"
                    class="k-col-label-content"
                >
                    <slot
                        name="loading"
                        :skeletonLoaderPropsValue="skeletonLoaderPropsValue"
                    >
                        <v-skeleton-loader
                            v-bind="skeletonLoaderPropsValue"
                        />
                    </slot>
                </v-col>

                <v-col
                    v-else
                    key="data"
                    class="k-col-label-content"
                >
                    <v-slide-y-reverse-transition
                        mode="out-in"
                    >
                        <div
                            v-if="editMode"
                            class="k-col-label-content-wrapper edit"
                            key="edit"
                        >
                            <slot
                                name="edit"
                                v-bind="bindSlotData"
                            />
                        </div>

                        <div
                            v-else
                            key="read"
                            class="k-col-label-content-wrapper"
                        >
                            <slot
                                name="view"
                                v-bind="bindSlotData"
                            >
                                <slot
                                    name="default"
                                    v-bind="bindSlotData"
                                />
                            </slot>
                        </div>
                    </v-slide-y-reverse-transition>
                </v-col>
            </v-scroll-y-transition>
        </v-row>
    </v-col>
</template>
