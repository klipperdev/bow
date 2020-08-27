<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <k-data-list v-bind="$attrs" v-on="$listeners" ref="dataList">
        <template v-slot:no-items>
            <k-no-result-message :dense="noResultDense"></k-no-result-message>
        </template>

        <template v-slot:header="{total}">
            <div class="d-flex align-center mt-4 mb-4">
                <k-list-view v-if="showListView && !!$refs.dataList && !!$refs.dataList.metadata"
                             :type="$refs.dataList.metadata"
                             @change="$refs.dataList.refresh()"
                >
                </k-list-view>

                <v-icon v-if="!!icon"
                        class="mr-3"
                        :color="$color('primary', 'primary lighten-3')"
                >
                    {{ icon }}
                </v-icon>

                <span v-if="!!title" :class="$classes('text-h6')">
                    {{ title }}
                </span>

                <v-fade-transition mode="out-in">
                    <v-chip small outlined class="ml-2" v-if="null !== total">
                        {{ $number(total, 0) }}
                    </v-chip>
                </v-fade-transition>
            </div>
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
    @Component({
        inheritAttrs: false,
    })
    export default class KStandardDataList extends Vue {
        @Prop({type: Boolean, default: true})
        public showListView!: boolean;

        @Prop({type: [String, undefined], default: undefined})
        public title!:string|undefined;

        @Prop({type: [String, undefined], default: undefined})
        public icon!:string|undefined;

        @Prop({type: Boolean, default: false})
        public noResultDense!: boolean;
    }
</script>
