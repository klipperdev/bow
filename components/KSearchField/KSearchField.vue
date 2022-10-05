<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-text-field
        v-bind="$attrs"
        v-on="$listeners"
        v-model="search"
    />
</template>

<script lang="ts">
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {defineComponent, PropType} from '@vue/composition-api';
import {CreateElement, Props, RenderContext, VNode} from 'vue';
import {VTextField} from 'vuetify/lib/components';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default defineComponent({
    name: 'KSearchField',

    props: {
        prefix: {
            type: String,
            required: true,
        }
    },

    data(): Dictionary<any> {
        return {
            search: '' as PropType<string>,
        };
    },

    created(): void {
        this.$root.$on(this.prefix + '-in', this.onSearchIn);
        this.$root.$on(this.prefix + '-refresh', this.onSearchRefresh);

        this.$root.$emit(this.prefix + '-created');
    },

    destroyed(): void {
        this.$root.$off(this.prefix + '-in', this.onSearchIn);
        this.$root.$off(this.prefix + '-refresh', this.onSearchRefresh);
    },

    methods: {
        refresh(): void {
            this.$root.$emit(this.prefix + '-request-refresh');
        },

        onSearchIn(searchValue: string):void {
            this.search = searchValue;
        },

        onSearchRefresh(): void {
            this.$root.$emit(this.prefix + '-out', this.search);
        },
    },

    watch: {
        search: {
            handler(searchValue?: string): void {
                this.$root.$emit(this.prefix + '-out', searchValue);
            },
        },
    },
});
</script>
