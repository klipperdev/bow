<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

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
                {{ metadata ? $t('form.alert.field-name', {'name': $metadata.getFieldOrAssociationLabel(metadata, childName)}) : childName + ' :' }}
            </span>

            <slot name="child" :childErrors="child"/>
        </li>
    </ul>
</template>

<script lang="ts">
import BaseFormAlertErrors from './BaseFormAlertErrors';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class FormAlertErrors extends BaseFormAlertErrors {
}
</script>
