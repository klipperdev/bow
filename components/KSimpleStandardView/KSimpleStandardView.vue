<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KSimpleStandardView.ts" />

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
