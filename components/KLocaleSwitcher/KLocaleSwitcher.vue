<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KLocaleSwitcher.ts" />

<template>
    <v-btn
        v-bind="$attrs"
        v-on="$listeners"
        :id="'localeSwitcher_' + _uid"
        @click="onClickButton"
    >
        <span>
            {{ currentLocale }}
        </span>

        <v-icon
            class="mr-n1"
        >
            arrow_drop_down
        </v-icon>

        <!-- Available locales of resource -->
        <v-menu
            v-model="open"
            :activator="'#localeSwitcher_' + _uid"
            :open-on-click="false"
            :close-on-content-click="false"
            transition="slide-y-transition"
            min-width="200px"
            max-height="90vh"
        >
            <v-list>
                <v-list-item
                    v-if="allowAdd"
                    @click="onClickButtonAdd"
                >
                    <v-list-item-content>
                        <v-list-item-title
                            v-text="$t('add.translation')"
                        ></v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-icon>
                        <v-icon
                            color="accent"
                            small
                        >
                            fa-fw fa-plus-circle
                        </v-icon>
                    </v-list-item-icon>
                </v-list-item>

                <k-swipe-item
                    v-for="available in resourceAvailableLocales"
                    :key="available.code"
                    :disabled="currentLocale === available.code"
                    ref="availableLocaleItems"
                >
                    <template v-slot:action-right="{toggleRight}">
                        <v-btn
                            class="btn-actions"
                            block
                            depressed
                            color="error"
                           @click="deleteAvailableLocaleConfirm(available.code, toggleRight)"
                        >
                            {{ deleteConfirmationLabel || $t('delete') }}
                        </v-btn>
                    </template>

                    <template v-slot:default="{toggleRight}">
                        <v-list-item
                            @click.prevent="onSelectAvailableLocale(available.code)"
                            :disabled="currentLocale === available.code"
                        >
                            <v-list-item-content>
                                <v-list-item-title
                                    v-text="available.name"
                                />
                            </v-list-item-content>

                            <v-list-item-action
                                v-if="allowRemove"
                            >
                                <v-btn icon
                                       small
                                       color="error"
                                       :disabled="currentLocale === available.code"
                                       @click.stop="toggleRight()"
                                >
                                    <v-icon
                                        small
                                    >
                                        delete
                                    </v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                    </template>
                </k-swipe-item>
            </v-list>
        </v-menu>

        <!-- List all available locales -->
        <v-menu
            v-model="openStepAdd"
            :activator="'#localeSwitcher_' + _uid"
            :open-on-click="false"
            :close-on-content-click="false"
            :transition="openStepAdd ? 'slide-x-reverse-transition' : 'slide-y-transition'"
            min-width="300px"
            max-height="90vh"
        >
            <v-text-field
                v-model="search"
                full-width
                hide-details
                :label="$t('search')"
                prepend-inner-icon="search"
                single-line
                solo
                flat
                clearable
                autofocus
                color="accent"
            >
                <template v-slot:append>
                    <v-btn
                        icon
                        ripple
                        color="accent"
                        @click="onClickButtonPrevious()"
                    >
                        <v-icon>
                            fa-fw fa-chevron-circle-left
                        </v-icon>
                    </v-btn>
                </template>
            </v-text-field>

            <v-list
                v-if="0 === countAllAvailableLocales"
                key="noResult"
            >
                <k-no-result-message dense />
            </v-list>

            <v-list
                v-else
                key="result"
            >
                <v-list-item
                    v-for="available in allAvailableLocales"
                    :key="available.code"
                    :disabled="isLocaleAlreadyUsed(available.code)"
                    @click.prevent="onSelectNewAvailableLocale(available.code)"
                >
                    <v-list-item-content>
                        <v-list-item-title v-text="available.name" />
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-menu>
    </v-btn>
</template>
