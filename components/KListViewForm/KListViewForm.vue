<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-dialog
        eager
        v-model="dialog"
        max-width="900"
        persistent
        transition=""
    >
        <v-card>
            <v-card-title
                :class="$classes('primary--text', 'text--lighten-2')"
            >
                <slot
                    name="view-title"
                >
                    {{ $ml('list_view') }}
                </slot>

                <v-spacer />

                <k-delete-action
                    v-if="!!id"
                    v-bind="btnProps"
                    :title="label"
                    v-model="id"
                    small
                    :delete-call="deleteView"
                    @deleted="onDeletedView"
                />
            </v-card-title>

            <v-form
                ref="form"
                class="v-card__content-scroller"
                @submit.prevent=""
            >
                <v-container
                    class="pt-3 pb-3"
                    style="max-height: calc(82vh - 120px);"
                >
                    <k-form-alert
                        :http-error="previousError"
                        metadata="list_view"
                        dismissible
                        :excluded-fields="['label', 'name', 'filters']"
                    />

                    <v-row>
                        <k-col-label
                            vertical
                            :label="$mfl('list_view', 'label')"
                        >
                            <v-text-field
                                v-bind="inputProps"
                                type="text"
                                name="label"
                                v-model="label"
                                autofocus
                                :error-messages="fieldErrors('label')"
                                :disabled="loading"
                                :rules="[$r('required')]"
                                @keydown.enter="save"
                            />
                        </k-col-label>

                        <k-col-label
                            vertical
                            :label="$mfl('list_view', 'name')"
                        >
                            <v-text-field
                                v-bind="inputProps"
                                type="text"
                                name="name"
                                v-model="name"
                                :error-messages="fieldErrors('name')"
                                :disabled="loading"
                                :rules="[$r('required')]"
                                @keydown.enter="save"
                            />
                        </k-col-label>
                    </v-row>

                    <v-row>
                        <v-col
                            class="pt-3 pb-3"
                        >
                            <v-switch
                                :label="$t('advanced-mode')"
                                :disabled="true"
                                v-model.sync="advancedMode"
                                class="mt-0"
                                color="primary"
                                hide-details
                            />
                        </v-col>
                    </v-row>

                    <v-row
                        v-if="advancedMode" key="advanced"
                    >
                        <k-col-label
                            vertical
                            :label="$mfl('list_view', 'filters')"
                            :col-props="{sm: 12}"
                        >
                            <v-textarea
                                v-bind="inputProps"
                                auto-grow
                                name="filters"
                                v-model="filters"
                                :error-messages="fieldErrors('filters')"
                                :disabled="loading"
                                :rules="[$r('required'), $r('json')]"
                            />
                        </k-col-label>
                    </v-row>

                    <v-row
                        v-else
                        key="standard"
                    />
                </v-container>
            </v-form>

            <v-card-actions>
                <v-spacer />

                <v-btn
                    v-bind="btnProps"
                    text
                    :depressed="false"
                    :color="undefined"
                    :disabled="loading"
                    @click="dialog = false"
                >
                    {{ $t('cancel') }}
                </v-btn>

                <v-btn
                    v-bind="btnProps"
                    :depressed="[true, undefined].includes($attrs.depressed)"
                    color="primary"
                    :loading="loading"
                    :disabled="loading || !advancedMode"
                    @click="save()"
                >
                    {{ $t('save') }}
                </v-btn>

                <v-btn
                    v-bind="btnProps"
                    :depressed="[true, undefined].includes($attrs.depressed)"
                    color="secondary"
                    :loading="loading"
                    :disabled="loading || !advancedMode"
                    @click="save(true)"
                >
                    {{ $t('save.copy') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import {AjaxContent} from '@klipper/bow/composables/mixins/http/ajaxContent';
import {AjaxFormContent} from '@klipper/bow/composables/mixins/http/ajaxFormContent';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {Canceler} from '@klipper/http-client/Canceler';
import {ListViewResponse} from '@klipper/sdk/models/responses/ListViewResponse';
import {defineComponent, PropType} from '@vue/composition-api';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default defineComponent({
    name: 'KListViewForm',

    inheritAttrs: false,

    mixins: [
        AjaxContent,
        AjaxFormContent,
    ],

    props: {
        type: {
            type: String,
            default: undefined,
        },

        btnProps: {
            type: Object as PropType<Dictionary<any>>,
            default: () => ({}),
        },

        inputProps: {
            type: Object as PropType<Dictionary<any>>,
            default: () => ({}),
        },

        routeQueryPrefix: {
            type: String,
            default: undefined,
        },
    },

    data(): Dictionary<any> {
        return {
            id: null as string|number|null,
            label: null as string|null,
            name: null as string|null,
            filters: null as string|null,
            advancedMode: true as boolean,
            dialog: false as boolean,
        };
    },

    mounted(): void {
        this.$root.$on('list-view-form-open-' + (this.routeQueryPrefix || 'main'), this.open);
    },

    destroyed(): void {
        this.$root.$off('list-view-form-open-' + (this.routeQueryPrefix || 'main'), this.open);
    },

    methods: {
        open(value?: ListViewResponse): void {
            this.id = value && value.id || null;
            this.label = value && value.label || null;
            this.name = value && value.name || null;
            this.filters = value && value.filters ? JSON.stringify(value.filters) : null;
            this.advancedMode = true;

            this.dialog = true;
        },

        close(): void {
            this.id = null;
            this.label = null;
            this.name = null;
            this.filters = null;
            this.advancedMode = true;

            this.dialog = false;
        },

        toggle(): void {
            this.dialog = !this.dialog;
        },

        async save(copy: boolean = false): Promise<void> {
            if (this.advancedMode && this.isValidForm()) {
                const editMode = !!this.id && !copy;
                const res = await this.fetchData<Dictionary<any>>(async (canceler: Canceler): Promise<Dictionary<any>|null> => {
                    return await this.$api.request({
                        url: this.$org + '/list_views' + (editMode ? '/' + this.id : ''),
                        method: editMode ? 'PATCH' : 'POST',
                        data: {
                            label: this.label,
                            name: this.name,
                            type: this.type,
                            filters: this.filters ? JSON.parse(this.filters) : undefined,
                        },
                    }, canceler);
                }, false);

                if (res) {
                    this.$emit('change', res);
                    this.close();
                }
            }
        },

        async deleteView(id: string|number, canceler: Canceler): Promise<any> {
            await this.$api.request({
                url: this.$org + '/list_views/' + id,
                method: 'DELETE',
            }, canceler);

            return id;
        },

        onDeletedView(id: string|number): void {
            this.$emit('delete', id);
            this.close();
        },
    },

    watch: {
        dialog: {
            handler(open: boolean): void {
                this.resetPreviousError();
                this.resetFormValidation();

                this.$emit(open ? 'open' : 'close');
                this.$emit('toggle', open);
            }
        },
    },
});
</script>
