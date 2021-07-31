<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KQueryBuilder.ts" />

<template>
    <div
        v-if="!!$scopedSlots.fields"
        class="k-query-builder"
    >
        <v-btn
            fab
            depressed
            small
            :plain="!buttonActivated"
            :color="buttonActivated ? 'primary' : undefined"
            @click="toggle"
        >
            <v-icon
                small
            >
                fa-fw fa-sliders-h
            </v-icon>
        </v-btn>

        <v-dialog
            v-bind="genDialogProps"
            v-model="dialog"
        >
            <v-card>
                <v-card-title
                    :class="self.$classes('primary--text', 'text--lighten-2')"
                >
                    <slot
                        name="form-title"
                    >
                        {{ $t('search') }}
                    </slot>
                </v-card-title>

                <v-form
                    ref="form"
                    class="v-card__content-scroller"
                    style="max-height: calc(82vh - 120px);"
                    @submit.prevent=""
                >
                    <slot
                        name="fields"
                        v-bind="genSlotProps"
                    />
                </v-form>

                <v-card-actions>
                    <v-spacer />

                    <v-btn
                        text
                        ripple
                        @click="close()"
                    >
                        {{ $t('close') }}
                    </v-btn>

                    <v-btn
                        text
                        ripple
                        color="primary"
                        @click="reset()"
                    >
                        {{ $t('reset') }}
                    </v-btn>

                    <v-btn
                        color="primary"
                        depressed
                        ripple
                        @click="filter()"
                    >
                        {{ $t('filter') }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <slot
            name="default"
        />
    </div>
</template>
