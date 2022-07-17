<template>
    <v-dialog
        v-model="dialog"
        v-bind="$attrs"
        v-on="$listeners"
        :disabled="disabled"
    >
        <template v-slot:activator="{on}">
            <slot
                name="activator"
                :on="on"
                v-bind="genActivatorSlotProps"
            />
        </template>

        <slot
            name="modal"
            v-bind="genSlotProps"
        >
            <slot
                name="default"
                v-bind="genSlotProps"
            />
        </slot>
    </v-dialog>
</template>

<script lang="ts">
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {defineComponent} from '@vue/composition-api';

export default defineComponent({
    name: 'KActionModal',

    inheritAttrs: false,

    props: {
        openOnRootEventName: {
            type: String,
            default: undefined,
        },

        disabled: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            dialog: false,
            payload: undefined as any|undefined,
        };
    },

    computed: {
        isOpened(): boolean {
            return this.dialog;
        },

        genActivatorSlotProps(): Dictionary<any> {
            return {
                isOpened: this.isOpened,
                open: this.open,
                close: this.close,
                payload: this.payload,
            };
        },

        genSlotProps(): Dictionary<any> {
            return {
                isOpened: this.isOpened,
                open: this.open,
                close: this.close,
                payload: this.payload,
            };
        },
    },

    mounted(): void {
        if (!!this.openOnRootEventName) {
            this.$root.$on(this.openOnRootEventName, this.onOpenOnRootEventName);
        }
    },

    destroyed() {
        if (!!this.openOnRootEventName) {
            this.$root.$off(this.openOnRootEventName, this.onOpenOnRootEventName);
        }
    },

    methods: {
        open(payload?: any): void {
            if (!this.disabled) {
                this.payload = payload;
                this.dialog = true;
            }
        },

        close(): void {
            this.dialog = false;
        },

        onOpenOnRootEventName(payload?: any): void {
            this.open(payload);
        },
    },

    watch: {
        dialog: {
            handler(dialog: boolean): void {
                if (dialog) {
                    this.$emit('opened', this.payload);
                } else {
                    this.$emit('closed');
                    this.payload = undefined;
                }
            },
        },
    },
});
</script>
