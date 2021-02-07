<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KImportAction.ts" />

<template>
    <v-btn
        v-bind="$attrs"
        v-on="$listeners"
        :id="'importAction_' + _uid"
        :loading="loading"
        @click="onClickButton"
    >
        <slot name="icon">
            <v-icon v-bind="genIconProps">{{ icon }}</v-icon>
        </slot>

        <k-import-wizard
            v-bind="wizardProps"
            v-model="open"
            :activator="'#importAction_' + _uid"
            :metadata="metadata"
            :formats="formats"
            @loading="onLoading"
        />
    </v-btn>
</template>
