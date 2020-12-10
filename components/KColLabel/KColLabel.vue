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
        v-if="!unwrap"
    >
        <v-row
            :class="rowClasses"
        >
            <v-col
                v-if="!hideLabel"
                v-bind="labelPropsValue"
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

            <v-col
                v-if="isLoading"
                key="loading"
                :class="{
                    'k-col-label-content': true,
                    'd-flex': contentRight,
                    'justify-end': contentRight,
                }"
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
                        :class="{
                            'k-col-label-content-wrapper': true,
                            'text-right': contentRight,
                        }"
                    >
                        <slot
                            name="read-prepend"
                            v-bind="bindSlotData"
                        />

                        <slot
                            name="read"
                            v-bind="bindSlotData"
                        >
                            <slot
                                name="default"
                                v-bind="bindSlotData"
                            />
                        </slot>

                        <slot
                            name="read-append"
                            v-bind="bindSlotData"
                        />
                    </div>
            </v-col>
        </v-row>
    </v-col>


    <div
        v-else-if="editMode"
        class="k-col-label-content-unwrap edit"
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
        class="k-col-label-content-unwrap"
    >
        <slot
            name="read"
            v-bind="bindSlotData"
        >
            <slot
                name="default"
                v-bind="bindSlotData"
            />
        </slot>
    </div>
</template>
