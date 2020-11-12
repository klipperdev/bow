<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KStandardViewFieldPersonFullName.ts" />

<template>
    <k-col-label
        :label="$mfl(standardData.metadata, 'full_name')"
        :edit-mode="standardData.editMode"
        edit-label-required
    >
        <template v-slot:read>
            <slot name="read" v-bind="standardData">
                {{ getName(standardData.data) }}
            </slot>

            <slot name="read.append" v-bind="standardData"/>
        </template>

        <template v-slot:edit>
            <v-row>
                <v-col
                    cols="12"
                    xl="3"
                    class="pt-0 pb-O"
                >
                    <k-standard-view-field-association-choice
                        name="salutation"
                        unwrap
                    />
                </v-col>

                <v-col
                    cols="12"
                    md="6"
                    xl="4"
                    class="pt-0 pb-O"
                >
                    <k-standard-view-field-text
                        name="first_name"
                        unwrap
                        autofocus
                    />
                </v-col>

                <v-col
                    cols="12"
                    md="6"
                    xl="5"
                    class="pt-0 pb-O"
                >
                    <k-standard-view-field-text
                        name="last_name"
                        unwrap
                    />
                </v-col>
            </v-row>
        </template>
    </k-col-label>
</template>
