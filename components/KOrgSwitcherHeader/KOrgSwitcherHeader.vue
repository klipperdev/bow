<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KOrgSwitcherHeader.ts" />

<template>
    <v-list
        rounded
    >
        <!-- Mini Header -->
        <div
            v-if="mini"
        >
            <v-list-item
                :id="'orgSwitcherHeader_' + _uid"
            >
                <v-btn
                    v-if="hasRetryRequired"
                    key="retry"
                    fab
                    width="50"
                    height="50"
                    text
                    color="red"
                    rounded
                    ripple
                    :loading="loading"
                    @click.stop="retry"
                >
                    <v-icon>
                        refresh
                    </v-icon>
                </v-btn>

                <v-avatar
                    v-else-if="hasOrgBadge"
                    key="orgBadge"
                    size="50"
                    :color="badgeBackgroundColor"
                    @click.stop="$store.commit('account/toggleOrganizationSwitcher')"
                >
                    <k-img
                        :api-src="badgeUrl"
                        :key="badgeUrl"
                        mode="cover"
                        transition="fade-transition"
                    ></k-img>
                </v-avatar>

                <v-avatar
                    v-else-if="mini"
                    key="appBadge"
                    tile
                    size="50"
                    @click.stop="$store.commit('account/toggleOrganizationSwitcher')"
                >
                    <v-img
                        :src="appBadge"
                        contain
                    ></v-img>
                </v-avatar>

                <v-tooltip
                    :activator="'#orgSwitcherHeader_' + _uid"
                    right
                    :disabled="miniBadgeTooltipDisabled"
                    open-delay="120"
                    nudge-right="8"
                    transition="slide-x-transition"
                    :color="$store.state.darkMode.enabled ? 'primary lighten-2' : 'primary lighten-1'"
                >
                    <span>
                        {{ title }}
                    </span>
                </v-tooltip>
            </v-list-item>

            <v-list-item>
                <v-btn
                    icon
                    color="blue-grey"
                    @click="$emit('click-mini-drawer')"
                >
                    <v-icon
                        small
                    >
                        fa-fw fa-chevron-right
                    </v-icon>
                </v-btn>
            </v-list-item>
        </div>

        <!-- Full Header -->
        <v-list-item
            v-if="!mini"
        >
            <v-row
                class="mt-0 mb-0"
                align="center"
            >
                <v-col
                    cols="3"
                ></v-col>

                <v-col
                    cols="6"
                    class="d-flex justify-center"
                >
                    <v-avatar
                        v-if="hasOrgBadge"
                        key="orgBadge"
                        size="76"
                        :color="badgeBackgroundColor"
                        @click.stop="$store.commit('account/toggleOrganizationSwitcher')"
                    >
                        <k-img
                            :api-src="hasOrgBadge ? $store.state.account.organizationInfo.imageUrl : undefined"
                            :key="hasOrgBadge ? $store.state.account.organizationInfo.imageUrl : undefined"
                            mode="cover"
                            transition="fade-transition"
                        ></k-img>
                    </v-avatar>

                    <v-avatar
                        v-else
                        key="appBadge"
                        tile
                        size="76"
                        @click.stop="$store.commit('account/toggleOrganizationSwitcher')"
                    >
                        <v-img
                            :src="appBadge"
                            contain
                        ></v-img>
                    </v-avatar>
                </v-col>

                <v-col
                    cols="3"
                >
                    <v-btn
                        icon
                        color="blue-grey"
                        @click="$emit('click-mini-drawer')"
                    >
                        <v-icon
                            x-small
                        >
                            fa-fw fa-chevron-left
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-list-item>

        <v-list-item
            v-if="!mini"
            class="pl-0 pr-0 justify-center"
            dense
        >
            <v-btn
                v-if="hasRetryRequired"
                key="retry"
                text
                color="red"
                rounded
                ripple
                :loading="loading"
                @click="retry"
            >
                <v-icon>
                    refresh
                </v-icon>
            </v-btn>

            <v-btn
                v-else
                :key="title"
                text
                rounded
                ripple
                small
                :loading="loading"
                @click="$store.commit('account/toggleOrganizationSwitcher')"
            >
                <span
                    style="max-width: 170px; overflow: hidden; text-overflow: ellipsis;"
                >
                    {{ title }}
                </span>

                <v-icon
                    class="ml-1"
                    x-small
                >
                    fa-fw fa-angle-double-right
                </v-icon>
            </v-btn>
        </v-list-item>
    </v-list>
</template>
