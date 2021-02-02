<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KListView.ts" />

<template>
    <div
        class="k-list-view"
    >
        <v-autocomplete
            ref="select"
            v-model="select"
            v-bind="selectProps"
            :search-input.sync="searchInput"
            :items="items"
            :loading="loading"
            :color="color"
            :item-text="itemText"
            :item-value="itemValue"
            :label="label"
            :disabled="disabled"
            filled
            chips
            single-line
            clearable
            rounded
            :menu-props="{rounded: true}"
            hide-details
            hide-selected
            return-object
            prepend-inner-icon="fa-fw fa-filter"
            @change="onChange"
        >
            <template v-slot:no-data>
                <v-container
                    v-if="!!search && 0 === items.length"
                    class="pa-0"
                    fluid
                    fill-height
                >
                    <v-row
                        align="center"
                        justify="center"
                    >
                        <v-col
                            class="text-align-center"
                        >
                            <k-lottie
                                center
                                width="140px"
                                :options="{animationData: iconDataNoResult, loop: false}"
                            />

                            <h5
                                class="mt-2 mb-5"
                            >
                                {{ $t('view.no-result') }}
                            </h5>
                        </v-col>
                    </v-row>
                </v-container>

                <span v-else/>
            </template>

            <template v-slot:prepend-item>
                <v-list-item
                    @click="$refs.form.open()"
                >
                    <v-list-item-title>
                        {{ $t('view.create') }}
                    </v-list-item-title>

                    <v-list-item-action>
                        <v-btn
                            small
                            icon
                            text
                            color="primary"
                        >
                            <v-icon
                                small
                            >
                                fa-fw fa-plus-circle
                            </v-icon>
                        </v-btn>
                    </v-list-item-action>
                </v-list-item>
            </template>

            <template v-slot:item="{item}">
                <v-list-item-title>
                    {{ item.label }}
                </v-list-item-title>

                <v-list-item-action>
                    <v-btn
                        small
                        icon
                        text
                        color="primary"
                        @click.stop="$refs.form.open(item)"
                    >
                        <v-icon
                            x-small
                        >
                            fa-fw fa-pen
                        </v-icon>
                    </v-btn>
                </v-list-item-action>
            </template>

            <template v-slot:selection="{attr, on, item, selected, disabled}">
                <v-chip
                    v-bind="attr"
                    :input-value="selected"
                    :color="color"
                    :disabled="disabled"
                    class="white--text"
                    v-on="on"
                    @click="$refs.form.open(item)"
                >
                    <v-icon
                        left
                        x-small
                    >
                        fa-fw fa-sliders-h
                    </v-icon>

                    <span
                        v-text="item.label"
                    />
                </v-chip>
            </template>
        </v-autocomplete>

        <k-list-view-form
            ref="form"
            :type="type"
            @change="onChangeList"
            @delete="onDelete"
            @toggle="onFormToggle"
        />

        <slot
            name="default"
        />
    </div>
</template>
