<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./OrganizationList.ts" />

<template>
    <v-container>
        <v-row
            v-if="loading"
            justify="center"
            align="center"
        >
            <v-col>
                <v-list-item>
                    <k-loading
                        class="mt-5"
                    />
                </v-list-item>
            </v-col>
        </v-row>

        <v-data-iterator
            v-else
            style="width: 100%"
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
            <template v-slot:no-data>
                <k-no-result-message
                    v-if="!!search"
                    class="mt-5"
                />

                <k-icon-message
                    v-else
                    class="mt-5"
                    icon="fa-fw fa-building"
                    icon-color="primary"
                    icon-size="10em"
                    :message="$t('no-organizations')">
                </k-icon-message>
            </template>

            <template v-slot:default="props">
                <v-row>
                    <v-col
                        v-for="item in props.items"
                        :key="item.name"
                        cols="12"
                        sm="4"
                        md="4"
                        lg="3"
                    >
                        <div
                            class="d-flex"
                        >
                            <v-spacer/>

                            <router-link
                                :to="getRoute(item)"
                            >
                                <v-avatar
                                    width="92px"
                                    height="92px"
                                    color="white"
                                >
                                    <k-img
                                        v-if="item.image_url"
                                        :api-src="item.image_url"
                                        mode="cover"
                                    >
                                        <template v-slot:default="{loaded}">
                                            <v-container
                                                v-if="!loaded"
                                            >
                                                <v-row
                                                    class="fill-height ma-0"
                                                    align="center"
                                                    justify="center"
                                                >
                                                    <v-icon
                                                        x-large
                                                        color="primary"
                                                    >
                                                        fa-fw fa-building
                                                    </v-icon>
                                                </v-row>
                                            </v-container>
                                        </template>
                                    </k-img>

                                    <v-icon
                                        v-else
                                        x-large
                                        color="primary"
                                    >
                                        fa-fw fa-building
                                    </v-icon>
                                </v-avatar>
                            </router-link>

                            <v-spacer/>
                        </div>

                        <div
                            class="d-flex mt-3"
                        >
                            <v-spacer/>

                            <v-btn
                                depressed
                                rounded
                                ripple
                                small
                                color="primary"
                                :to="getRoute(item)"
                            >
                                {{ item.label }}
                            </v-btn>

                            <v-spacer/>
                        </div>
                    </v-col>
                </v-row>
            </template>
        </v-data-iterator>
    </v-container>
</template>
