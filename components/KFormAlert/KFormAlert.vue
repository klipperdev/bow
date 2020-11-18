<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KFormAlert.ts" />

<template>
    <v-alert
        type="error"
        class="ma-2"
        mode="out-in"
        :value="showFormAlert"
    >
        {{ formAlert }}

        <k-form-alert-errors
            v-if="!!httpError && !!httpError.errors"
            :errors="httpError.errors"
            :metadata="metadata"
            :excluded-children="excludedFields"
        />
    </v-alert>
</template>
