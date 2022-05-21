<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div
        v-if="displayCreate"
        v-bind="$attrs"
        v-on="$listeners"
        class="k-tabbed-standard-view"
    >
        <slot
            name="create"
            v-bind="bindSlotData"
        />
    </div>

    <k-loader-wrapper
        v-else
        v-bind="$attrs"
        v-on="$listeners"
        :loading="fetchLoading"
        class="k-tabbed-standard-view"
        @keydown="onKeyDown"
    >
        <!-- Heading -->
        <k-heading>
            <slot
                name="heading-prepend"
                v-bind="bindSlotData"
            />

            <slot
                name="heading"
                v-bind="bindSlotData"
            >
                <v-container
                    v-bind="headingContainerProps"
                    :fluid="headingFluid"
                >
                    <v-row class="ma-0">
                        <v-col cols="12">
                            <k-standard-header>
                                <k-standard-view-title/>
                            </k-standard-header>
                        </v-col>
                    </v-row>
                </v-container>
            </slot>

            <slot
                name="heading-append"
                v-bind="bindSlotData"
            />

            <v-container
                v-bind="headingContainerTabsProps"
                class="py-0 mb-0"
                :fluid="headingFluid"
            >
                <v-row class="ma-0">
                    <v-tabs
                        ref="tabs"
                        v-bind="tabsProps"
                        v-model="genTab"
                        show-arrows
                        :centered="tabsCentered"
                        :right="tabsRight"
                    >
                        <v-tab
                            v-for="tab in genTabs"
                            :key="tab.name"
                            :disabled="(isCreate && !tab.isCreatable) || (!isCreate && tab.disabled)"
                        >
                            {{ tab.label }}

                            <v-badge
                                v-if="!isCreate && tab.isCountable"
                                :color="self.$store.state.darkMode.enabled ? 'blue-grey darken-3' : 'blue-grey lighten-4'"
                                inline
                                :content="tab.genCount.toString()"
                                @click.prevent.stop=""
                            />
                        </v-tab>
                    </v-tabs>
                </v-row>
            </v-container>
        </k-heading>

        <!-- Contents -->
        <v-tabs-items
            v-model="tab"
            touchless
            style="background-color: transparent;"
        >
            <slot
                name="tabs"
                v-bind="bindSlotData"
            />
        </v-tabs-items>

        <slot
            name="default"
            v-bind="bindSlotData"
        />
    </k-loader-wrapper>
</template>

<script lang="ts">
import {Selfable} from '@klipper/bow/mixins/Selfable';
import {StandardMasterComponent} from '@klipper/bow/mixins/StandardMasterComponent';
import {StandardViewTabbable} from '@klipper/bow/mixins/StandardViewTabbable';
import {mixins} from 'vue-class-component';
import {Component, Ref} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KTabbedStandardView extends mixins(
    Selfable,
    StandardMasterComponent,
    StandardViewTabbable,
) {
    @Ref('tabs')
    declare protected tabsRef: Vue|any;

    protected get displayCreate(): boolean {
        return this.isCreate && !!this.$scopedSlots.create;
    }

    private get bindSlotData(): any {
        return Object.assign(this.genSlotProps, this.genTabbableBindSlotData);
    }
}
</script>
