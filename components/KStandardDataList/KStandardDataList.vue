<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <k-data-list v-bind="$attrs" v-on="$listeners" ref="dataList">
        <template v-slot:no-items>
            <k-no-result-message></k-no-result-message>
        </template>

        <template v-slot:header="{total}">
            <v-subheader :class="$classes('pl-0 mt-4 mb-4 primary--text', 'text--lighten-3')">
                <k-list-view v-if="showListView && !!$refs.dataList && !!$refs.dataList.metadata"
                             :type="$refs.dataList.metadata"
                             @change="$refs.dataList.refresh()"
                >
                </k-list-view>

                <span v-else-if="!!title" class="text-h5">
                    {{ title }}
                </span>

                <v-fade-transition mode="out-in">
                    <v-chip small outlined class="ml-2" v-if="null !== total">
                        {{ $number(total, 0) }}
                    </v-chip>
                </v-fade-transition>
            </v-subheader>
        </template>

        <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope" />
        </template>
    </k-data-list>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KStandardDataList extends Vue {
        @Prop({type: Boolean, default: true})
        public showListView!: boolean;

        @Prop({type: [String, undefined], default: undefined})
        public title!:string|undefined;
    }
</script>
