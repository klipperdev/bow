<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KDrawerSectionSettings.ts" />

<template>
    <v-list
        rounded
        dense
    >
        <slot
            name="prepend"
        />

        <v-list-item
            :id="'drawerSectionSettings_' + self._uid"
            :to="{name: 'settings', params: {'org': self.$org}}"
            active-class="primary white--text white--icon"
            @click.stop=""
        >
            <v-list-item-icon>
                <v-icon
                    dense
                >
                    fa-fw fa-cog
                </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
                <v-list-item-title>
                    {{ $t('views.settings.title') }}
                </v-list-item-title>
            </v-list-item-content>

            <v-tooltip
                :activator="'#drawerSectionSettings_' + self._uid"
                right
                open-delay="120"
                :disabled="tooltipDisabled"
                nudge-right="8"
                transition="slide-x-transition"
                :color="self.$store.state.darkMode.enabled ? 'primary lighten-2' : 'primary lighten-1'"
            >
                <span>
                    {{ $t('views.settings.title') }}
                </span>
            </v-tooltip>
        </v-list-item>

        <slot
            name="default"
        />
    </v-list>
</template>
