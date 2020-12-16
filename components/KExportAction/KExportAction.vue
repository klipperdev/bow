<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KExportAction.ts" />

<template>
    <v-btn
        v-bind="$attrs"
        v-on="$listeners"
        :id="'exportAction_' + _uid"
        @click="onClickButton"
    >
        <slot name="icon">
            <v-icon v-bind="genIconProps">{{ icon }}</v-icon>
        </slot>

        <v-icon
            v-if="!isSingle"
            v-bind="genIconProps"
        >
            arrow_drop_down
        </v-icon>

        <v-menu
            v-if="!isSingle"
            v-bind="genMenuProps"
            v-model="open"
            :activator="'#exportAction_' + _uid"
        >
            <v-list dense>
                <v-list-item
                    v-for="format in formats"
                    :key="format"
                    @click="exportAction(format)"
                >
                    <v-list-item-title>
                        <v-icon small left>{{ getFormatIcon(format) }}</v-icon>
                        {{ $t('export.format', {'format': getFormatLabel(format)}) }}
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </v-btn>
</template>
