<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KOrgSwitcher.ts" />

<template>
    <v-navigation-drawer
        color="blue-grey darken-4"
        dark
        temporary
        :touchless="!open"
        fixed
        :mini-variant="false"
        :hide-overlay="true"
        v-model="open"
    >
        <!-- Drawer Header -->
        <template v-slot:prepend>
            <v-list>
                <v-list-item>
                    <v-text-field
                        v-model="search"
                        clearable
                        solo-inverted
                        rounded
                        flat
                        hide-details
                        autofocus
                        :placeholder="$t('search')"
                        :value="search"
                        autocomplete="off"
                    >
                    </v-text-field>
                </v-list-item>

                <v-list-item>
                    <v-list-item-subtitle>
                        {{ $t('organization.switcher.availables') }}
                    </v-list-item-subtitle>
                </v-list-item>
            </v-list>
        </template>

        <!-- Drawer Footer -->
        <template v-slot:append>
            <!-- User context -->
            <v-list
                v-if="!!userItem"
                dense
                class="pt-1 pb-0"
            >
                <v-list-item
                    :to="getRoute(userItem)"
                    selectable
                    class="ml-0 mr-0"
                >
                    <v-list-item-avatar
                        :color="userItem.image_url ? 'white' : ''"
                    >
                        <k-img
                            v-if="userItem.image_url"
                            :api-src="userItem.image_url"
                            :key="userItem.image_url"
                            mode="cover"
                        >
                            <template v-slot:default="{loaded}">
                                <div
                                    v-if="!loaded"
                                    class="d-flex justify-center v-image"
                                >
                                    <v-icon
                                        color="primary"
                                    >
                                        fa-fw fa-user
                                    </v-icon>
                                </div>
                            </template>
                        </k-img>

                        <v-icon
                            v-else
                        >
                            fa-fw fa-user
                        </v-icon>
                    </v-list-item-avatar>

                    <v-list-item-title>
                        {{ userItem.label }}
                    </v-list-item-title>
                </v-list-item>
            </v-list>

            <!-- Org pagination -->
            <v-row
                class="ml-0 mr-0"
            >
                <v-col
                    cols="3"
                    class="pl-1 pr-0"
                >
                    <v-btn
                        small
                        rounded
                        ripple
                        icon
                        @click="refresh"
                    >
                        <v-icon
                            small
                        >refresh</v-icon>
                    </v-btn>

                    <v-btn
                        small
                        rounded
                        ripple
                        icon
                        :to="{name: 'user-organization', params: {org: $org, id: 'create'}}"
                    >
                        <v-icon
                            small
                        >
                            add
                        </v-icon>
                    </v-btn>
                </v-col>

                <v-col
                    cols="7"
                    class="text-center"
                >
                    <v-fade-transition
                        mode="out-in"
                    >
                        <div
                            v-if="hasPagination"
                        >
                            <v-btn
                                small
                                rounded
                                ripple
                                icon
                                @click="previousPage" :disabled="page <= 1"
                            >
                                <v-icon
                                    small
                                >
                                    chevron_left
                                </v-icon>
                            </v-btn>

                            <v-fade-transition
                                mode="out-in"
                            >
                                <span
                                    :key="page"
                                    class="ml-2 text-caption white--text"
                                >
                                    {{ page }}
                                </span>
                            </v-fade-transition>

                            <span
                                class="ml-2 mr-2 text-caption white--text"
                            >
                                /
                            </span>

                            <span
                                class="mr-2 text-caption white--text"
                            >
                                {{ pages > 0 ? pages : 1 }}
                            </span>

                            <v-btn
                                small
                                rounded
                                ripple
                                icon
                                @click="nextPage" :disabled="page >= pages"
                            >
                                <v-icon
                                    small
                                >
                                    chevron_right
                                </v-icon>
                            </v-btn>
                        </div>
                    </v-fade-transition>
                </v-col>

                <v-col
                    cols="2"
                    class="pl-2 pr-2 text-right"
                >
                    <v-btn
                        small
                        rounded
                        ripple
                        icon
                        @click="open = !open"
                    >
                        <v-icon
                            small
                        >
                            fa-fw fa-chevron-left
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </template>

        <!-- Organization list items -->
        <v-list
            dense
        >
            <v-fade-transition
                mode="out-in"
            >
                <v-list-item
                    v-if="loading"
                >
                    <k-loading
                        class="mt-5"
                        progress-color=""
                    ></k-loading>
                </v-list-item>

                <v-data-iterator
                    v-else
                    :items="items"
                    :items-per-page.sync="limit"
                    :page.sync="page"
                    :loading="loading"
                    :search="search"
                    item-key="name"
                    hide-default-footer
                    disable-pagination
                    disable-filtering
                    disable-sort
                >
                    <template v-slot:default="props">
                        <v-list-item
                            v-if="open"
                            v-for="item in props.items"
                            :key="item.name"
                            :to="getRoute(item)"
                            selectable
                        >
                            <v-list-item-avatar
                                color="white"
                            >
                                <k-img
                                    v-if="item.image_url"
                                    :api-src="item.image_url"
                                    :key="item.image_url"
                                    mode="cover"
                                >
                                    <template v-slot:default="{loaded}">
                                        <div
                                            v-if="!loaded"
                                            class="d-flex justify-center v-image"
                                        >
                                            <v-icon
                                                color="primary"
                                            >
                                                fa-fw fa-building
                                            </v-icon>
                                        </div>
                                    </template>
                                </k-img>

                                <v-icon
                                    v-else
                                    color="primary"
                                >
                                    fa-fw fa-building
                                </v-icon>
                            </v-list-item-avatar>

                            <v-list-item-title>
                                {{ item.label }}
                            </v-list-item-title>
                        </v-list-item>
                    </template>

                    <template v-slot:no-data>
                        <k-no-result-message/>
                    </template>
                </v-data-iterator>
            </v-fade-transition>
        </v-list>
    </v-navigation-drawer>
</template>
