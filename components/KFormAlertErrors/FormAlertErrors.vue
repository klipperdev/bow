<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./FormAlertErrors.ts" />

<template>
    <ul
        v-if="!!errors"
        v-bind="$attrs"
        v-on="$listeners"
    >
        <li v-for="errorMessage in errorMessages">
            {{ errorMessage }}
        </li>

        <li v-for="(child, childName) in filteredChildren">
            <span class="font-weight-bold">
                {{ metadata ? self.$t('form.alert.field-name', {'name': self.$metadata.getFieldOrAssociationLabel(metadata, childName)}) : childName + ' :' }}
            </span>

            <slot name="child" :childErrors="child"/>
        </li>
    </ul>
</template>
