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
        :icon="btnIcon"
        :loading="loading"
        @click="onClickButton"
    >
        <slot name="icon">
            <v-icon v-bind="genIconProps">{{ icon }}</v-icon>
        </slot>

        <k-import-wizard
            ref="wizard"
            v-bind="wizardProps"
            :metadata="metadata"
            :upload-endpoint="uploadEndpoint"
            :formats="formats"
            @loading="onLoading"
            @open="open = true"
            @close="open = false"
        />
    </v-btn>
</template>
