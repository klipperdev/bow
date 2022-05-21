<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <form-alert-errors
        v-bind="$attrs"
        v-on="$listeners"
    >
        <template v-slot:child="{childErrors}">
            <form-alert-errors
                :errors="childErrors"
            />
        </template>
    </form-alert-errors>
</template>

<script lang="ts">
import BaseFormAlertErrors from './BaseFormAlertErrors';
import {Component} from 'vue-property-decorator';
import FormAlertErrors from './FormAlertErrors.vue';
import FormAlertErrorsComponent from './FormAlertErrors';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component({
    components: {
        FormAlertErrors,
    }
})
export default class KFormAlertErrors extends BaseFormAlertErrors {
}
</script>
