<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-container
        v-if="loader && fetchLoading"
        :fluid="containerFluid"
    >
        <k-loading
            class="mt-5"
        />
    </v-container>

    <v-container
        v-else-if="showError && !editMode"
        :fluid="containerFluid"
    >
        <k-error-message
            :message="errorMessage" :error-code="errorCode"
        >
            <v-btn
                v-if="errorCode > 0"
                depressed
                rounded
                small
                color="primary"
                class="ma-3 mt-5"
                :to="{path: '/'}"
            >
                {{ $t('error.go-to-home') }}
            </v-btn>

            <v-btn
                depressed
                rounded
                small
                color="secondary"
                class="ma-3 mt-5"
                @click="refresh()"
            >
                {{ $t('refresh') }}
            </v-btn>
        </k-error-message>
    </v-container>

    <k-loader-wrapper
        v-else
        :loading="fetchLoading"
    >
        <!-- Heading -->
        <k-heading
            v-if="tabbed"
        >
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
                                :color="$store.state.darkMode.enabled ? 'blue-grey darken-3' : 'blue-grey lighten-4'"
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
                name="prepend-tabs"
                v-bind="bindSlotData"
            />

            <k-tabbed-standard-view-tab
                :name="tabName"
                :label="tabLabel"
                :fluid="containerFluid"
                creatable
            >
                <slot
                    name="main-top"
                    v-bind="bindSlotData"
                />

                <v-row>
                    <slot
                        name="main-prepend"
                        v-bind="bindSlotData"
                    />

                    <slot
                        name="main"
                        v-bind="bindSlotData"
                    >
                        <v-col>
                            <div
                                class="d-flex flex-column fill-height"
                                @keydown="onKeyDown"
                            >
                                <slot
                                    name="header-prepend"
                                    v-bind="bindSlotData"
                                />

                                <slot
                                    v-if="!hideStandardHeader"
                                    name="header-wrapper"
                                    v-bind="bindSlotData"
                                >
                                    <k-standard-header class="flex-grow-0">
                                        <template v-slot:header>
                                            <slot
                                                name="header"
                                                v-bind="bindSlotData"
                                            />
                                        </template>

                                        <template v-slot:actions>
                                            <slot
                                                name="header-actions-prepend"
                                                v-bind="bindSlotData"
                                            />

                                            <slot
                                                name="header-actions"
                                                v-bind="bindSlotData"
                                            >
                                                <k-standard-header-button
                                                    color="primary"
                                                    icon="refresh"
                                                    outlined
                                                    :loading="fetchLoading"
                                                    :disabled="editMode"
                                                    @click="refresh()"
                                                />
                                            </slot>

                                            <slot
                                                name="header-actions-append"
                                                v-bind="bindSlotData"
                                            />
                                        </template>
                                    </k-standard-header>
                                </slot>

                                <slot
                                    name="header-append"
                                    v-bind="bindSlotData"
                                />

                                <slot
                                    name="content"
                                    v-bind="bindSlotData"
                                >
                                    <v-form
                                        class="flex-grow-1 flex-shrink-1"
                                        ref="form"
                                        :disabled="isFormDisabled"
                                        :readonly="formReadOnly"
                                        @submit.prevent=""
                                        autocomplete="off"
                                    >
                                        <slot
                                            name="form"
                                            v-bind="bindSlotData"
                                        >
                                            <v-card class="fill-height">
                                                <slot
                                                    name="card-prepend"
                                                    v-bind="bindSlotData"
                                                />

                                                <v-tabs
                                                    centered
                                                    v-if="displayEditStandardDeleteAction"
                                                    key="edit-prepend"
                                                >
                                                    <v-btn
                                                        text
                                                        rounded
                                                        color="primary"
                                                        @click="cancelEdit(true)" :disabled="loading"
                                                    >
                                                        {{ $t('cancel')}}
                                                    </v-btn>

                                                    <v-btn
                                                        depressed
                                                        rounded
                                                        color="primary"
                                                        :disabled="fetchLoading"
                                                        :loading="pushLoading"
                                                        @click="push"
                                                    >
                                                        {{ $t('save')}}
                                                    </v-btn>

                                                    <v-btn
                                                        v-if="isTranslatable"
                                                        text
                                                        class="text-uppercase"
                                                        rounded
                                                        disabled
                                                    >
                                                        {{ currentLocale }}
                                                    </v-btn>
                                                </v-tabs>

                                                <v-tabs
                                                    v-else-if="displayStandardActions"
                                                    key="view-prepend"
                                                    centered
                                                >
                                                    <slot
                                                        name="standard-actions-prepend"
                                                        v-bind="bindSlotData"
                                                    />

                                                    <slot
                                                        name="standard-actions-prepend-top"
                                                        v-bind="bindSlotData"
                                                    />

                                                    <slot
                                                        name="standard-actions"
                                                        v-bind="bindSlotData"
                                                    />

                                                    <slot
                                                        name="standard-actions-top"
                                                        v-bind="bindSlotData"
                                                    />

                                                    <k-standard-view-button
                                                        v-if="displayStandardEditAction && !disableStandardActions"
                                                        icon="edit"
                                                        rounded
                                                        :disabled="loading"
                                                        @click="enableEdit()"
                                                    />

                                                    <k-delete-action
                                                        v-if="displayStandardDeleteAction && !disableStandardActions"
                                                        v-model="id"
                                                        rounded
                                                        :disabled="loading || !id"
                                                        :delete-call="deleteItem"
                                                        @deleted="onDeletedItem"
                                                    />

                                                    <k-locale-switcher
                                                        v-if="isTranslatable"
                                                        text
                                                        rounded
                                                        color="primary"
                                                        :disabled="loading"
                                                        :locale="selectedLocale || undefined"
                                                        :available-locales="dataAvailableLocales"
                                                        :allow-add="displayStandardEditAction && !disableLocaleActions"
                                                        :allow-remove="displayStandardDeleteAction && !disableLocaleActions"
                                                        @change="onLocaleChange"
                                                        @delete="onLocaleDelete"
                                                    />

                                                    <slot
                                                        name="standard-actions-append"
                                                        v-bind="bindSlotData"
                                                    />

                                                    <slot
                                                        name="standard-actions-append-top"
                                                        v-bind="bindSlotData"
                                                    />
                                                </v-tabs>

                                                <k-form-alert
                                                    :http-error="previousError"
                                                    :metadata="metadataName"
                                                    :excluded-fields="errorExcludedFields"
                                                    dismissible
                                                />

                                                <slot
                                                    name="card"
                                                    v-bind="bindSlotData"
                                                />

                                                <v-tabs
                                                    v-if="displayEditStandardDeleteAction"
                                                    key="edit-append"
                                                    centered
                                                >
                                                    <v-btn
                                                        text
                                                        rounded
                                                        color="primary"
                                                        @click="cancelEdit(true)" :disabled="loading"
                                                    >
                                                        {{ $t('cancel')}}
                                                    </v-btn>

                                                    <v-btn
                                                        depressed
                                                        rounded
                                                        color="primary"
                                                        :disabled="fetchLoading"
                                                        :loading="pushLoading"
                                                        @click="push"
                                                    >
                                                        {{ $t('save')}}
                                                    </v-btn>

                                                    <v-btn
                                                        v-if="isTranslatable"
                                                        text
                                                        class="text-uppercase"
                                                        rounded
                                                        disabled
                                                    >
                                                        {{ currentLocale }}
                                                    </v-btn>
                                                </v-tabs>

                                                <v-tabs
                                                    centered
                                                    v-else-if="displayStandardActions && editMode"
                                                    key="view-append"
                                                >
                                                    <slot
                                                        name="standard-actions-prepend"
                                                        v-bind="bindSlotData"
                                                    />

                                                    <slot
                                                        name="standard-actions-prepend-bottom"
                                                        v-bind="bindSlotData"
                                                    />

                                                    <slot
                                                        name="standard-actions"
                                                        v-bind="bindSlotData"
                                                    />

                                                    <slot
                                                        name="standard-actions-bottom"
                                                        v-bind="bindSlotData"
                                                    />

                                                    <k-standard-view-button
                                                        v-if="displayStandardEditAction && !disableStandardActions"
                                                        icon="edit"
                                                        rounded
                                                        :disabled="loading"
                                                        @click="enableEdit()"
                                                    />

                                                    <k-delete-action
                                                        v-if="displayStandardDeleteAction && !disableStandardActions"
                                                        v-model="id"
                                                        rounded
                                                        :disabled="loading || !id"
                                                        :delete-call="deleteItem"
                                                        @deleted="onDeletedItem"
                                                    />

                                                    <k-locale-switcher
                                                        v-if="isTranslatable"
                                                        text
                                                        rounded
                                                        color="primary"
                                                        :disabled="loading"
                                                        :locale="selectedLocale || undefined"
                                                        :available-locales="dataAvailableLocales"
                                                        :allow-add="displayStandardEditAction && !disableLocaleActions"
                                                        :allow-remove="displayStandardDeleteAction && !disableLocaleActions"
                                                        @change="onLocaleChange"
                                                        @delete="onLocaleDelete"
                                                    />

                                                    <slot
                                                        name="standard-actions-append"
                                                        v-bind="bindSlotData"
                                                    />

                                                    <slot
                                                        name="standard-actions-append-bottom"
                                                        v-bind="bindSlotData"
                                                    />
                                                </v-tabs>

                                                <slot
                                                    name="card-append"
                                                    v-bind="bindSlotData"
                                                />
                                            </v-card>
                                        </slot>
                                    </v-form>
                                </slot>
                            </div>
                        </v-col>
                    </slot>

                    <slot
                        name="main-append"
                        v-bind="bindSlotData"
                    />
                </v-row>

                <slot
                    v-if="displayLists"
                    name="lists-prepend"
                    v-bind="bindSlotData"
                />

                <slot
                    v-if="displayLists"
                    name="lists"
                    v-bind="bindSlotData"
                />

                <slot
                    v-if="displayLists"
                    name="lists-append"
                    v-bind="bindSlotData"
                />

                <slot
                    name="footer-prepend"
                    v-bind="bindSlotData"
                />

                <slot
                    name="footer"
                    v-bind="bindSlotData"
                />

                <slot
                    name="footer-append"
                    v-bind="bindSlotData"
                />

                <slot
                    name="main-bottom"
                    v-bind="bindSlotData"
                />
            </k-tabbed-standard-view-tab>

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
import {StandardComponentActionable} from '@klipper/bow/mixins/StandardComponentActionable';
import {StandardViewTabbable} from '@klipper/bow/mixins/StandardViewTabbable';
import {mixins} from 'vue-class-component';
import {Component, Prop, Ref, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KStandardView extends mixins(
    StandardComponentActionable,
    StandardViewTabbable,
) {
    @Prop({type: Boolean, default: false})
    public loader!: boolean;

    @Prop({type: Boolean, default: true})
    public editModeKeepList!: boolean;

    @Prop({type: Boolean, default: false})
    public tabbed!: boolean;

    @Prop({type: Boolean, default: false})
    public containerFluid!: boolean;

    @Prop({type: String, default: 'details'})
    public tabName!: string;

    @Prop({type: String, default() {
        return this.$t('details');
    }})
    public tabLabel!: string;

    @Ref('tabs')
    declare protected tabsRef: Vue|any;

    private get displayLists(): boolean {
        return !this.isCreate && (!this.editMode || (this.editMode && this.editModeKeepList));
    }

    private get showError(): boolean {
        return (this.loader && !this.data)
            || (this.loader && !!this.previousError);
    }

    private get bindSlotData(): any {
        return Object.assign({
            showError: this.showError,
            displayLists: this.displayLists,
        }, this.genTabbableBindSlotData, this.genSlotProps);
    }

    @Watch('tabbed', {immediate: true})
    protected watchTabbed(tabbed: boolean): void {
        if (!tabbed && null === this.tab) {
            this.setTabIndex(0);
        }
    }
}
</script>
