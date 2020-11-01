<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-text-field
        v-bind="textAttrs"
        v-on="textListeners"
        v-model="formattedValue"
        @change="onChange"
    >
        <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]>
            <slot :name="slot" />
        </template>
    </v-text-field>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component({
        inheritAttrs: false,
    })
    export default class KNumberField extends Vue {
        @Prop({type: Number, default: undefined})
        public scale!: number;

        public get textAttrs(): any {
            const $attrs = Object.assign({}, this.$attrs);
            delete $attrs.value;

            return Object.assign({
                type: 'text',
            }, $attrs);
        }

        public get textListeners(): any {
            const $listeners = Object.assign({}, this.$listeners);
            delete $listeners.input;

            return $listeners;
        }

        public get formattedValue(): string|undefined {
            return this.$numberFormatter.number(this.$attrs.value, this.scale);
        }

        public set formattedValue(value?: string) {
            // Only emit the input event on change event
        }

        public onChange(value?: string) {
            this.$emit('input', this.$numberFormatter.parseNumber(value, this.scale));
        }
    }
</script>
