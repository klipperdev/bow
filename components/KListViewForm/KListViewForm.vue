<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-dialog
        v-model="dialog"
        max-width="900"
        persistent
    >
        <v-card>
            <v-card-title :class="$classes('primary--text', 'text--lighten-3')">
                <slot name="view-title">
                    {{ $ml('list_view') }}
                </slot>

                <v-spacer></v-spacer>

                <v-card-actions v-if="!!id">
                    <k-delete-action
                        :title="label"
                        v-model="id"
                        rounded
                        small
                        :delete-call="deleteView"
                        @deleted="onDeletedView">
                    </k-delete-action>
                </v-card-actions>
            </v-card-title>

            <v-form ref="form" @submit.prevent class="v-card__content-scroller">
                <v-container class="pt-0 pb-0" style="max-height: 69vh;">
                    <v-alert type="error"
                             class="ma-1"
                             transition="slide-y-reverse-transition"
                             mode="out-in"
                             :value="showFormAlert">
                        {{ formAlert }}

                        <ul v-if="this.previousError && this.previousError.errors && this.previousError.errors.errors">
                            <li v-for="error in this.previousError.errors.errors" :key="error">{{ error }}</li>
                        </ul>
                    </v-alert>

                    <v-row>
                        <k-col-label vertical :label="$mfl('list_view', 'label')">
                            <v-text-field type="text"
                                          outlined
                                          v-model="label"
                                          autofocus
                                          :error-messages="fieldErrors('label')"
                                          @keydown.enter="save"
                                          :disabled="loading"
                                          :rules="[$r('required')]"
                            ></v-text-field>
                        </k-col-label>

                        <k-col-label vertical :label="$mfl('list_view', 'name')">
                            <v-text-field type="text"
                                          outlined
                                          v-model="name"
                                          :error-messages="fieldErrors('name')"
                                          @keydown.enter="save"
                                          :disabled="loading"
                                          :rules="[$r('required')]"
                            ></v-text-field>
                        </k-col-label>
                    </v-row>

                    <v-row>
                        <v-col class="pt-0 pb-0">
                            <v-switch
                                :label="$t('advanced-mode')"
                                :disabled="true"
                                v-model.sync="advancedMode"
                                class="mt-0"
                                :color="$color('primary', 'primary lighten-3')"
                                hide-details
                            ></v-switch>
                        </v-col>
                    </v-row>

                    <v-expand-transition mode="out-in">
                        <v-row v-if="advancedMode" key="advanced">
                            <k-col-label vertical :label="$mfl('list_view', 'filters')" :col-props="{sm: 12}">
                                <v-textarea auto-grow
                                            outlined
                                            v-model="filters"
                                            :error-messages="fieldErrors('filters')"
                                            :disabled="loading"
                                            :rules="[$r('required'), $r('json')]"
                                ></v-textarea>
                            </k-col-label>
                        </v-row>

                        <v-row v-else key="standard"></v-row>
                    </v-expand-transition>
                </v-container>
            </v-form>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text
                       ripple
                       rounded
                       :disabled="loading"
                       @click="dialog = false">
                    {{ $t('cancel') }}
                </v-btn>

                <v-btn color="primary"
                       depressed
                       ripple
                       rounded
                       :loading="loading"
                       :disabled="loading || !advancedMode"
                       @click="save()">
                    {{ $t('save') }}
                </v-btn>

                <v-btn color="primary"
                       depressed
                       ripple
                       rounded
                       :loading="loading"
                       :disabled="loading || !advancedMode"
                       @click="save(true)">
                    {{ $t('save.copy') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
    import {Component, Prop, Watch} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {MapKey} from '@klipper/http-client/models/MapKey';
    import {Canceler} from '@klipper/http-client/Canceler';
    import {ListViewResponse} from '@klipper/sdk/models/responses/ListViewResponse';
    import {AjaxContent} from '@klipper/bow/mixins/http/AjaxContent';
    import {AjaxFormContent} from '@klipper/bow/mixins/http/AjaxFormContent';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KListViewForm extends mixins(AjaxContent, AjaxFormContent) {
        @Prop({type: String, default: undefined})
        public type!: string|undefined;

        public id: string|number|null = null;

        public label: string|null = null;

        public name: string|null = null;

        public filters: string|null = null;

        private dialog: boolean = false;

        public advancedMode: boolean = true;

        public open(value?: ListViewResponse): void {
            this.id = value && value.id || null;
            this.label = value && value.label || null;
            this.name = value && value.name || null;
            this.filters = value && value.filters ? JSON.stringify(value.filters) : null;

            this.dialog = true;
        }

        public close(): void {
            this.dialog = false;
        }

        public toggle(): void {
            this.dialog = !this.dialog;
        }

        @Watch('dialog')
        public watchDialog(open: boolean): void {
            if (open) {
                this.resetFormValidation();
            }
        }

        public async save(copy: boolean = false): Promise<void> {
            if (this.advancedMode && this.isValidForm()) {
                const editMode = !!this.id && !copy;
                const res = await this.fetchData<MapKey>(async (canceler: Canceler): Promise<MapKey|null> => {
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
        }

        public async deleteView(id: string|number, canceler: Canceler): Promise<any> {
            await this.$api.request({
                url: this.$org + '/list_views/' + id,
                method: 'DELETE',
            }, canceler);

            return id;
        }

        public async onDeletedView(id: string|number): Promise<void> {
            this.$emit('delete', id);
            this.close();
        }
    }
</script>
