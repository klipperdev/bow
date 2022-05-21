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
                :class="self.$classes('primary--text', 'text--lighten-2')"
            >
                <slot
                    name="view-title"
                >
                    {{ $ml('list_view') }}
                </slot>

                <v-spacer />

                <v-card-actions
                    v-if="!!id"
                >
                    <k-delete-action
                        :title="label"
                        v-model="id"
                        rounded
                        small
                        :delete-call="deleteView"
                        @deleted="onDeletedView"
                    />
                </v-card-actions>
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
                            :label="self.$mfl('list_view', 'label')"
                        >
                            <v-text-field
                                type="text"
                                outlined
                                name="label"
                                v-model="label"
                                autofocus
                                :error-messages="fieldErrors('label')"
                                :disabled="loading"
                                :rules="[self.$r('required')]"
                                @keydown.enter="save"
                            />
                        </k-col-label>

                        <k-col-label
                            vertical
                            :label="self.$mfl('list_view', 'name')"
                        >
                            <v-text-field
                                type="text"
                                outlined
                                name="name"
                                v-model="name"
                                :error-messages="fieldErrors('name')"
                                :disabled="loading"
                                :rules="[self.$r('required')]"
                                @keydown.enter="save"
                            />
                        </k-col-label>
                    </v-row>

                    <v-row>
                        <v-col
                            class="pt-3 pb-3"
                        >
                            <v-switch
                                :label="self.$t('advanced-mode')"
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
                            :label="self.$mfl('list_view', 'filters')"
                            :col-props="{sm: 12}"
                        >
                            <v-textarea
                                auto-grow
                                outlined
                                name="filters"
                                v-model="filters"
                                :error-messages="fieldErrors('filters')"
                                :disabled="loading"
                                :rules="[self.$r('required'), self.$r('json')]"
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
                    text
                    rounded
                    ripple
                    color="primary"
                    :disabled="loading"
                    @click="dialog = false"
                >
                    {{ $t('cancel') }}
                </v-btn>

                <v-btn
                    color="primary"
                    depressed
                    rounded
                    ripple
                    :loading="loading"
                    :disabled="loading || !advancedMode"
                    @click="save()"
                >
                    {{ $t('save') }}
                </v-btn>

                <v-btn
                    color="secondary"
                    depressed
                    rounded
                    ripple
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
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {AjaxContent} from '@klipper/bow/mixins/http/AjaxContent';
import {AjaxFormContent} from '@klipper/bow/mixins/http/AjaxFormContent';
import {Selfable} from '@klipper/bow/mixins/Selfable';
import {Canceler} from '@klipper/http-client/Canceler';
import {ListViewResponse} from '@klipper/sdk/models/responses/ListViewResponse';
import {mixins} from 'vue-class-component';
import {Component, Prop, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KListViewForm extends mixins(
    AjaxContent,
    AjaxFormContent,
    Selfable,
) {
    @Prop({type: String})
    public type!: string|undefined;

    private id: string|number|null = null;

    private label: string|null = null;

    private name: string|null = null;

    private filters: string|null = null;

    private dialog: boolean = false;

    private advancedMode: boolean = true;

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

    private async save(copy: boolean = false): Promise<void> {
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
    }

    private async deleteView(id: string|number, canceler: Canceler): Promise<any> {
        await this.$api.request({
            url: this.$org + '/list_views/' + id,
            method: 'DELETE',
        }, canceler);

        return id;
    }

    private async onDeletedView(id: string|number): Promise<void> {
        this.$emit('delete', id);
        this.close();
    }

    @Watch('dialog')
    private watchDialog(open: boolean): void {
        this.resetPreviousError();
        this.resetFormValidation();

        this.$emit(open ? 'open' : 'close');
        this.$emit('toggle', open);
    }
}
</script>
