<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div :class="classes">
        <slot name="previous" v-bind="bindSlotData">
            <v-btn icon rounded ripple color="accent" @click="$emit('previous')" :disabled="disabled || page <= 1">
                <v-icon>chevron_left</v-icon>
            </v-btn>
        </slot>

        <slot name="pagination">
            <slot name="pagination-page">
                <v-fade-transition mode="out-in">
                    <span class="ml-2 text-caption" :key="page">{{ page }}</span>
                </v-fade-transition>
            </slot>

            <slot name="pagination-separator">
                <span class="ml-2 mr-2 text-caption">/</span>
            </slot>

            <slot name="pagination-pages">
                <span class="mr-2 text-caption">{{ pages > 0 ? pages : 1 }}</span>
            </slot>
        </slot>

        <slot name="next" v-bind="bindSlotData">
            <v-btn icon rounded ripple color="accent" @click="$emit('next')" :disabled="disabled || page >= pages">
                <v-icon>chevron_right</v-icon>
            </v-btn>
        </slot>
    </div>
</template>

<script lang="ts">
    import {Component, Prop} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {Themeable} from '@klipper/bow/mixins/Themeable';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KMenuPagination extends mixins(Themeable) {
        @Prop({type: Number, required: true})
        public page!: number;

        @Prop({type: Number, required: true})
        public limit!: number;

        @Prop({type: Number, required: true})
        public pages!: number;

        @Prop({type: Number, required: true})
        public total!: number;

        @Prop({type: Boolean, default: false})
        public disabled!: boolean;

        public get classes(): Record<string, boolean> {
            return {
                'k-menu-pagination': true,
                'mt-1': true,
                'mb-1': true,
                'text-center': true,
                ...this.themeClasses,
            };
        }

        public get bindSlotData(): any {
            return {
                page: this.page,
                limit: this.limit,
                pages: this.pages,
                total: this.total,
                disabled: this.disabled,
            };
        }
    }
</script>
