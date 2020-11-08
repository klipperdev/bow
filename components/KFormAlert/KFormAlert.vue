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
        transition="scale-transition"
        mode="out-in"
        :value="showFormAlert"
    >
        {{ formAlert }}

        <ul>
            <li
                v-for="globalError in getFormAlertGlobalErrors()"
            >
                {{ globalError }}
            </li>

            <li
                v-for="(fieldError, fieldName) in getFormAlertFields(excludedFields)"
            >
                <span
                    class="font-weight-bold"
                >
                    {{ $t('form.alert.field_name', {'name': $metadata.getFieldOrAssociationLabel(metadata, fieldName)}) }}
                </span>

                <ul>
                    <li
                        v-for="error in fieldError.errors || []"
                    >
                        {{ error }}
                    </li>
                </ul>
            </li>
        </ul>
    </v-alert>
</template>
