<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KKanbanColumn.ts" />

<style lang="scss" src="./KKanbanColumn.scss" />

<template>
    <div
        class="k-kanban-column"
        v-bind="$attrs"
        v-on="$listeners"
        :style="genStyles"
    >
        <div
            v-if="displayHeader"
            class="k-kanban-column__header"
        >
            <slot
                name="header-prepend"
                v-bind="genSlotProps"
            />

            <v-toolbar
                v-if="displayHeaderToolbar"
                class="flex-grow-0"
            >
                <slot
                    name="header-title"
                    v-bind="genSlotProps"
                >
                    <v-toolbar-title
                        v-if="!!label"
                    >
                        <slot
                            name="header-title-prepend-inner"
                            v-bind="genSlotProps"
                        />

                        {{ label }}

                        <slot
                            name="header-title-append-inner"
                            v-bind="genSlotProps"
                        />
                    </v-toolbar-title>
                </slot>

                <v-spacer/>

                <slot
                    name="header-actions-prepend"
                    v-bind="genSlotProps"
                />

                <v-menu
                    v-if="displayHeaderToolbarMenu"
                    bottom
                    left
                    :disabled="disabled"
                >
                    <template v-slot:activator="{on, attrs}">
                        <v-btn
                            v-bind="attrs"
                            v-on="on"
                            small
                            icon
                            :disabled="disabled"
                        >
                            <v-icon small>fa-fw fa-ellipsis-v</v-icon>
                        </v-btn>
                    </template>

                    <slot
                        name="header-actions-menu"
                        v-bind="genSlotProps"
                    />
                </v-menu>

                <slot
                    name="header-actions-append"
                    v-bind="genSlotProps"
                />
            </v-toolbar>

            <slot
                name="header"
                v-bind="genSlotProps"
            />
        </div>

        <div
            ref="content"
            class="k-kanban-column__content"
            v-bind="contentProps"
        >
            <slot
                name="default"
                v-bind="genSlotProps"
            />
        </div>

        <div
            v-if="displayFooter"
            class="k-kanban-column__footer"
        >
            <slot
                name="footer-prepend"
                v-bind="genSlotProps"
            />

            <v-toolbar
                v-if="displayFooterToolbar"
                class="flex-grow-0"
            >
                <slot
                    name="footer-title"
                    v-bind="genSlotProps"
                />

                <v-spacer/>

                <slot
                    name="footer-actions-prepend"
                    v-bind="genSlotProps"
                />

                <v-menu
                    v-if="displayFooterToolbarMenu"
                    bottom
                    left
                >
                    <template v-slot:activator="{on, attrs}">
                        <v-btn
                            v-bind="attrs"
                            v-on="on"
                            small
                            icon
                        >
                            <v-icon small>fa-fw fa-ellipsis-v</v-icon>
                        </v-btn>
                    </template>

                    <slot
                        name="footer-actions-menu"
                        v-bind="genSlotProps"
                    />
                </v-menu>

                <slot
                    name="footer-actions-append"
                    v-bind="genSlotProps"
                />
            </v-toolbar>

            <slot
                name="footer"
                v-bind="genSlotProps"
            />
        </div>
    </div>
</template>
