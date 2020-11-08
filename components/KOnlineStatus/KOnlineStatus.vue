<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KOnlineStatus.ts" />

<template>
    <k-tooltip
        position="left"
        :message="$t(online ? 'online' : 'offline')"
        class="ml-3"
    >
        <v-scale-transition
            origin="center center"
            mode="out-in"
        >
            <v-icon
                v-if="!onlyOffline || (onlyOffline && !online)"
                :color="online ? 'grey lighten-1' : 'warning'"
                :key="online"
            >
                {{ online ? 'cloud_done' : 'cloud_off' }}
            </v-icon>
        </v-scale-transition>
    </k-tooltip>
</template>
