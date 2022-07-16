<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-dialog
        v-model="dialog"
        :persistent="loading"
        :max-width="dialogMaxWidth"
        content-class="scroller-theme--dark"
        transition=""
    >
        <template v-slot:activator="{on}">
            <slot
                name="activator"
                v-bind="genSlotProps"
                :on="on"
            >
                <slot
                    name="default"
                    v-bind="genSlotProps"
                    :on="on"
                />
            </slot>
        </template>

        <v-card>
            <v-card-title :class="$classes('', 'text--lighten-2')">
                <slot
                    name="title"
                    v-bind="genSlotProps"
                >
                    {{ dialogTitle }}
                </slot>
            </v-card-title>

            <v-card-text class="pt-4">
                <slot
                    name="text"
                    v-bind="genSlotProps"
                >
                    {{ dialogMessage }}
                </slot>
            </v-card-text>

            <v-card-actions>
                <v-spacer />

                <slot
                    name="actions-prepend"
                    v-bind="genSlotProps"
                />

                <v-btn
                    v-bind="genDialogButtonCancelProps"
                    :disabled="loading"
                    @click="cancel"
                >
                    {{ dialogButtonCancelTitle }}
                </v-btn>

                <v-btn
                    v-bind="genDialogButtonConfirmProps"
                    :loading="loading"
                    @click="confirmAction"
                >
                    {{ dialogButtonConfirmTitle }}
                </v-btn>

                <slot
                    name="actions-append"
                    v-bind="genSlotProps"
                />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {AjaxContent} from '@klipper/bow/composables/mixins/http/ajaxContent';
import {Canceler} from '@klipper/http-client/Canceler';
import {mixins} from 'vue-class-component';
import {Component, Model, Prop} from 'vue-property-decorator';
import {defineComponent, PropType} from '@vue/composition-api';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default defineComponent({
    name: 'KConfirmation',

    inheritAttrs: false,

    mixins: [
        AjaxContent,
    ],

    data(): Dictionary<any> {
        return {
            dialog: false as boolean,
        };
    },

    props: {
        dialogTitle: {
            type: String,
            default() {
                return this.$t('confirmation.title');
            },
        },

        dialogMessage: {
            type: String,
            default() {
                return this.$t('confirmation.text');
            },
        },

        dialogButtonConfirmTitle: {
            type: String,
            default() {
                return this.$t('confirm');
            },
        },

        dialogButtonConfirmProps: {
            type: Object,
            default: () => ({}),
        },

        dialogButtonCancelTitle: {
            type: String,
            default() {
                return this.$t('cancel');
            },
        },

        dialogButtonCancelProps: {
            type: Object,
            default: () => ({}),
        },

        dialogMaxWidth: {
            type: [String, Number],
            default: 400,
        },

        confirmRequest: {
            type: Function as PropType<<D, P = any>(canceler: Canceler, payload?: P) => Promise<D|null>>,
            required: true,
        },

        disabled: {
            type: Boolean,
            default: false,
        },

        payload: {
            default: undefined,
        },

        noErrorMessage: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        genDialogButtonConfirmProps(): Dictionary<any> {
            return {
                color: 'primary',
                depressed: true,
                ripple: true,
                loading: this.loading,
                disabled: this.loading,
                ...this.dialogButtonConfirmProps,
            };
        },

        genDialogButtonCancelProps(): Dictionary<any> {
            return {
                text: true,
                ripple: true,
                disabled: this.loading,
                ...this.dialogButtonCancelProps,
            };
        },

        genSlotProps(): Dictionary<any> {
            return {
                dialogTitle: this.dialogTitle,
                dialogMessage: this.dialogMessage,
                dialogButtonConfirmTitle: this.dialogButtonConfirmTitle,
                dialogButtonConfirmProps: this.dialogButtonConfirmProps,
                dialogButtonCancelTitle: this.dialogButtonCancelTitle,
                dialogButtonCancelProps: this.dialogButtonCancelProps,
                dialogMaxWidth: this.dialogMaxWidth,
                confirmRequest: this.confirmRequest,
                disabled: this.disabled,
                payload: this.payload,
                loading: this.loading,
                error: this.previousError,
            };
        },
    },

    methods: {
        confirm(): void {
            if (!this.disabled) {
                this.dialog = true;
            }
        },

        cancel(): void {
            this.dialog = false;
            this.$emit('cancel');
        },

        async confirmAction(): Promise<void> {
            let res = undefined;

            if (!this.disabled) {
                res = await this.fetchData<any>(async (canceler: Canceler) => {
                    return await this.confirmRequest(canceler, this.payload);
                }, !this.noErrorMessage, true);
            }

            this.dialog = false;

            if (this.previousError) {
                this.$emit('error', this.previousError);
            } else if (this.disabled) {
                this.$emit('cancel');
            } else {
                this.$emit('success', res);
            }
        },
    },

    watch: {
        dialog: {
            handler(dialog: boolean): void {
                this.$emit(dialog ? 'opened' : 'closed');
            },
        },
    },
});
</script>
