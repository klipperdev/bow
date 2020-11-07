<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-alert type="error"
             class="ma-2"
             transition="scale-transition"
             mode="out-in"
             :value="showFormAlert">
        {{ formAlert }}

        <ul>
            <li v-for="globalError in getFormAlertGlobalErrors()">
                {{ globalError }}
            </li>

            <li v-for="(fieldError, fieldName) in getFormAlertFields(excludedFields)">
                <span class="font-weight-bold">{{ $t('form.alert.field_name', {'name': $metadata.getFieldOrAssociationLabel(metadata, fieldName)}) }} </span>

                <ul>
                    <li v-for="error in fieldError.errors || []">
                        {{ error }}
                    </li>
                </ul>
            </li>
        </ul>
    </v-alert>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {HttpClientRequestError} from '@klipper/http-client/errors/HttpClientRequestError';
    import {Errors} from '@klipper/http-client/models/responses/Errors';
    import {getRequestErrorMessage, getFormAlertFields, getFormAlertGlobal} from '@klipper/bow/utils/error';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KFormAlert extends Vue {
        @Prop({type: Object|undefined})
        public httpError!: HttpClientRequestError|undefined;

        @Prop({type: Array, default: () => []})
        public excludedFields!: string[];

        @Prop({type: String, default: undefined})
        public metadata!: string;

        public get formAlert(): string|null {
            return this.httpError ? getRequestErrorMessage(this, this.httpError) : null;
        }

        public getFormAlertGlobalErrors(): string[] {
            return this.httpError ? getFormAlertGlobal(this.httpError) : [];
        }

        public getFormAlertFields(excludedChildren: string[] = []): Record<string, Errors> {
            return this.httpError ? getFormAlertFields(this.httpError, excludedChildren) : {};
        }

        public get showFormAlert(): boolean {
            return !!this.httpError;
        }
    }
</script>
