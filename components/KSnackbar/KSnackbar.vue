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
            return this.currentMessage?.multiline || false;
        },

        closeButton(): boolean {
            return typeof this.currentMessage?.closeButton === 'boolean'
                ? this.currentMessage.closeButton
                : this.defaultCloseButton;
        },

        timeout(): number|undefined {
            return this.currentMessage?.timeout;
        },

        color(): string {
            return this.currentMessage?.color || this.defaultColor;
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
