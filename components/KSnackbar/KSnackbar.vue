<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-snackbar
        v-model="show"
        v-bind="$attrs"
        v-on="$listeners"
        :multi-line="multiline"
        :timeout="timeout"
        :color="color"
    >
        <slot
            name="content"
            v-bind="genSlotProps"
        >
            <span
                v-html="translatedMessage"
            />

            <k-form-alert-errors
                v-if="!!errors"
                :errors="errors"
                :metadata="metadata"
                :excluded-children="excludedChildren"
            />
        </slot>

        <template v-slot:action="{attrs}">
            <slot
                name="action"
                v-bind="genSlotProps"
            >
                <v-btn
                    v-if="closeButton"
                    text
                    dark
                    small
                    :color="color"
                    :fab="0 === count"
                    v-bind="attrs"
                    @click="close"
                >
                    <span v-if="count > 0">
                        {{ $t('next.count', {count}) }}
                    </span>

                    <v-icon
                        v-else
                        small
                    >
                        close
                    </v-icon>
                </v-btn>
            </slot>
        </template>
    </v-snackbar>
</template>

<script lang="ts">
import {SnackbarMessage} from '@klipper/bow/snackbar/SnackbarMessage';
import {getFullErrorMessages} from '@klipper/bow/utils/error';
import {Errors} from '@klipper/http-client/models/responses/Errors';
import {defineComponent} from '@vue/composition-api';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default defineComponent({
    name: 'KSnackbar',

    inheritAttrs: false,

    props: {
        defaultCloseButton: {
            type: Boolean,
            default: false,
        },

        defaultColor: {
            type: String,
            default: 'info',
        },

        defaultTimeout: {
            type: [String, Number],
            default: '5000',
        },
    },

    data() {
        return {
            items: [] as SnackbarMessage[],
            currentMessage: SnackbarMessage|null,
            show: false as boolean,
        };
    },

    computed: {
        count(): number {
            return this.items.length;
        },

        message(): string|null {
            return this.currentMessage?.message || null;
        },

        translatedMessage(): string|null {
            return !!this.message && this.translatable ? this.$t(this.message) : this.message;
        },

        translatable(): boolean {
            return this.currentMessage?.translatable || false;
        },

        multiline(): boolean {
            if (undefined !== this.currentMessage?.multiline) {
                return this.currentMessage.multiline;
            }

            return !!this.errors
                ? getFullErrorMessages(this.errors, undefined, this.excludedChildren).length > 0
                : false;
        },

        closeButton(): boolean {
            return typeof this.currentMessage?.closeButton === 'boolean'
                ? this.currentMessage.closeButton
                : this.defaultCloseButton;
        },

        timeout(): number|undefined {
            return this.currentMessage?.timeout || this.defaultTimeout;
        },

        color(): string {
            return this.currentMessage?.color || this.defaultColor;
        },

        errors(): Errors|undefined {
            return this.currentMessage?.errors;
        },

        metadata(): string|undefined {
            return this.currentMessage?.metadata;
        },

        excludedChildren(): string[]|undefined {
            return this.currentMessage?.excludedChildren;
        },

        genSlotProps(): Dictionary<any> {
            return {
                count: this.count,
                currentMessage: this.currentMessage,
                message: this.message,
                translatedMessage: this.translatedMessage,
                translatable: this.translatable,
                multiline: this.multiline,
                closeButton: this.closeButton,
                timeout: this.timeout,
                color: this.color,
                errors: this.errors,
                metadata: this.metadata,
                excludedChildren: this.excludedChildren,
                close: this.close,
            };
        },
    },

    created(): void {
        window.addEventListener('klipper-snackbar-push-snack', this.onReceiveMessage);
    },

    destroyed(): void {
        window.removeEventListener('klipper-snackbar-push-snack', this.onReceiveMessage);
        this.reset();
    },

    methods: {
        close(): void {
            this.show = false;
        },

        reset(): void {
            this.items = [];
            this.currentMessage = null;
            this.show = false;
        },

        onReceiveMessage(event: Event): void {
            if (event instanceof MessageEvent && typeof event.data === 'object' && typeof event.data.message === 'string') {
                this.items.push(event.data);

                if (!this.show) {
                    this.show = true;
                }
            }
        },
    },

    watch: {
        show: {
            async handler(show: boolean): Promise<void> {
                if (show) {
                    const item = this.items.shift();

                    if (item) {
                        this.currentMessage = item;
                    } else {
                        this.show = false;
                    }
                } else {
                    await (new Promise((res) => setTimeout(res, 400)));

                    if (this.count > 0) {
                        this.show = true;
                    } else {
                        this.reset();
                    }
                }
            }
        },
    },
});
</script>
