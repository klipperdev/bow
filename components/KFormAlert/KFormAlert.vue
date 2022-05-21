<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-alert
        v-bind="genProps"
        v-on="$listeners"
        type="error"
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

<script lang="ts">
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {getRequestErrorMessage} from '@klipper/bow/utils/error';
import {HttpClientRequestError} from '@klipper/http-client/errors/HttpClientRequestError';
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KFormAlert extends Vue {
    @Prop({type: [Object, Error]})
    public httpError!: HttpClientRequestError|undefined;

    @Prop({type: Array, default: () => []})
    public excludedFields!: string[];

    @Prop({type: String})
    public metadata!: string;

    @Prop({type: String})
    public classes!: string;

    private get formAlert(): string | null {
        return this.httpError ? getRequestErrorMessage(this, this.httpError) : null;
    }

    private get showFormAlert(): boolean {
        return !!this.httpError;
    }

    private get genProps(): Dictionary<any> {
        return Object.assign({
            class: !this.classes ? 'mx-4 my-2' : this.classes,
        }, this.$attrs);
    }
}
</script>
