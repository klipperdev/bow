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
            };
        },

        genSlotProps(): Dictionary<any> {
            return {
                isOpened: this.isOpened,
                open: this.open,
                close: this.close,
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
        open(): void {
            if (!this.disabled) {
                this.dialog = true;
            }
        },

        close(): void {
            this.dialog = false;
        },

        onOpenOnRootEventName(): void {
            this.open();
        },
    },
});
</script>
