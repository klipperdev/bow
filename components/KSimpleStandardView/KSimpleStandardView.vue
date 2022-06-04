<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div v-if="showError">
        <slot
            name="error"
            v-bind="genSlotProps"
        >
            <k-error-message
                :message="errorMessage" :error-code="errorCode"
            >
                <v-btn
                    v-if="errorCode > 0"
                    depressed
                    rounded
                    small
                    color="primary"
                    class="ma-3 mt-5"
                    :to="{path: '/'}"
                >
                    {{ $t('error.go-to-home') }}
                </v-btn>

                <v-btn
                    depressed
                    rounded
                    small
                    color="secondary"
                    class="ma-3 mt-5"
                    @click="refresh()"
                >
                    {{ $t('refresh') }}
                </v-btn>
            </k-error-message>
        </slot>
    </div>

    <k-loader-wrapper
        v-else
        v-bind="$attrs"
        v-on="$listeners"
        :loading="fetchLoading"
        @keydown="onKeyDown"
    >
        <slot
            name="form"
            v-bind="genSlotProps"
        >
            <v-form
                ref="form"
                v-bind="formProps"
                :disabled="formDisabled"
                :readonly="formReadOnly"
                @submit.prevent=""
                autocomplete="off"
            >
                <slot
                    name="default"
                    v-bind="genSlotProps"
                />
            </v-form>
        </slot>
    </k-loader-wrapper>
</template>

<script lang="ts">
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {StandardMainComponent} from '@klipper/bow/mixins/StandardMainComponent';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KSimpleStandardView extends mixins(
    StandardMainComponent,
) {
    @Prop({type: Object, default: () => {}})
    public formProps!: Dictionary<any>;

    private get showError(): boolean {
        return !!this.previousError;
    }
}
</script>
