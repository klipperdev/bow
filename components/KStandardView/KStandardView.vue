<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-fade-transition mode="out-in">
        <k-loading v-if="loader && fetchLoading" class="mt-5"></k-loading>

        <k-error-message v-else-if="showError && !editMode" :message="errorMessage" :error-code="this.errorCode">
            <v-btn v-if="this.errorCode > 0"
                   depressed
                   rounded
                   small
                   :color="$color('primary lighten-4', 'primary lighten-3')"
                   class="ma-3 mt-5"
                   :to="{path: '/'}"
            >
                {{ $t('error.go-to-home') }}
            </v-btn>

            <v-btn depressed
                   rounded
                   small
                   :color="$color('primary lighten-4', 'primary lighten-3')"
                   class="ma-3 mt-5"
                   @click="refresh()"
            >
                {{ $t('refresh') }}
            </v-btn>
        </k-error-message>

        <k-loader-wrapper :loading="fetchLoading" v-else>
            <v-row class="ma-0" align="center">
                <v-col class="flex-grow-1 ma-0 pa-0 d-flex align-center">
                    <slot name="header" v-bind="bindSlotData"></slot>
                </v-col>
                <v-col class="flex-grow-0 flex-shrink-1 text-right">
                    <slot name="header-actions" v-bind="bindSlotData">
                        <v-btn :color="$color('primary', 'primary lighten-2')"
                               depressed
                               ripple
                               rounded
                               small
                               :loading="fetchLoading"
                               :disabled="editMode"
                               @click="refresh()"
                        >
                            <v-icon small>refresh</v-icon>
                        </v-btn>
                    </slot>
                </v-col>
            </v-row>

            <slot name="default" v-bind="bindSlotData">
                <v-form ref="form" @submit.prevent>
                    <v-card flat>
                        <v-fade-transition mode="out-in" origin="top center">
                            <v-tabs centered
                                    v-if="editMode"
                                    key="edit"
                            >
                                <v-btn text @click="cancelEdit(true)" :disabled="loading">
                                    {{ $t('cancel')}}
                                </v-btn>

                                <v-btn depressed color="accent" :disabled="fetchLoading" :loading="pushLoading" @click="push">
                                    {{ $t('save')}}
                                </v-btn>

                                <v-btn outlined disabled v-if="isTranslatable">
                                    {{ currentLocale }}
                                </v-btn>
                            </v-tabs>

                            <v-tabs centered
                                    v-else-if="displayStandardActions"
                                    key="view"
                            >
                                <slot name="standardActionsPrepend" v-bind="bindSlotData"></slot>

                                <slot name="standardActions" v-bind="bindSlotData"></slot>

                                <v-btn v-if="displayStandardEditAction && !disableStandardActions"
                                       outlined
                                       :disabled="loading"
                                       @click="enableEdit()"
                                >
                                    <v-icon>edit</v-icon>
                                </v-btn>

                                <k-delete-action v-if="displayStandardDeleteAction && !disableStandardActions"
                                    v-model="id"
                                    outlined
                                    :disabled="loading || !id"
                                    :delete-call="deleteItem"
                                    @deleted="onDeletedItem">
                                </k-delete-action>

                                <k-locale-switcher
                                    v-if="isTranslatable"
                                    outlined
                                    :disabled="loading"
                                    :locale="selectedLocale || undefined"
                                    :available-locales="dataAvailableLocales"
                                    :allow-add="displayStandardEditAction && !disableLocaleActions"
                                    :allow-remove="displayStandardDeleteAction && !disableLocaleActions"
                                    @change="onLocaleChange"
                                    @delete="onLocaleDelete"
                                ></k-locale-switcher>

                                <slot name="standardActionsAppend" v-bind="bindSlotData"></slot>
                            </v-tabs>
                        </v-fade-transition>

                        <k-form-alert :http-error="previousError" :metadata="metadata" :excluded-fields="['name', 'label']"></k-form-alert>

                        <slot name="card" v-bind="bindSlotData"></slot>

                        <v-fade-transition mode="out-in">
                            <v-tabs centered
                                    v-if="editMode"
                                    key="edit"
                            >
                                <v-btn text @click="cancelEdit(true)" :disabled="loading">
                                    {{ $t('cancel')}}
                                </v-btn>

                                <v-btn depressed color="accent" :disabled="fetchLoading" :loading="pushLoading" @click="push">
                                    {{ $t('save')}}
                                </v-btn>

                                <v-btn outlined disabled v-if="isTranslatable">
                                    {{ currentLocale }}
                                </v-btn>
                            </v-tabs>

                            <v-tabs centered
                                    v-else-if="displayStandardActions"
                                    key="view"
                            >
                                <slot name="standardActionsPrepend" v-bind="bindSlotData"></slot>

                                <slot name="standardActions" v-bind="bindSlotData"></slot>

                                <v-btn v-if="displayStandardEditAction && !disableStandardActions"
                                       outlined
                                       :disabled="loading"
                                       @click="enableEdit()"
                                >
                                    <v-icon>edit</v-icon>
                                </v-btn>

                                <k-delete-action v-if="displayStandardDeleteAction && !disableStandardActions"
                                                 v-model="id"
                                                 outlined
                                                 :disabled="loading || !id"
                                                 :delete-call="deleteItem"
                                                 @deleted="onDeletedItem">
                                </k-delete-action>

                                <k-locale-switcher
                                    v-if="isTranslatable"
                                    outlined
                                    :disabled="loading"
                                    :locale="selectedLocale || undefined"
                                    :available-locales="dataAvailableLocales"
                                    :allow-add="displayStandardEditAction && !disableLocaleActions"
                                    :allow-remove="displayStandardDeleteAction && !disableLocaleActions"
                                    @change="onLocaleChange"
                                    @delete="onLocaleDelete"
                                ></k-locale-switcher>

                                <slot name="standardActionsAppend" v-bind="bindSlotData"></slot>
                            </v-tabs>
                        </v-fade-transition>
                    </v-card>
                </v-form>

                <slot name="lists" v-bind="bindSlotData"></slot>
            </slot>
        </k-loader-wrapper>
    </v-fade-transition>
</template>

<script lang="ts">
    import {Component, Prop, Watch} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {AjaxFormContent} from '@klipper/bow/mixins/http/AjaxFormContent';
    import {FetchRequestDataEvent} from '@klipper/bow/http/event/FetchRequestDataEvent';
    import {FetchRequestDataFunction} from '@klipper/bow/http/request/FetchRequestDataFunction';
    import {PushRequestDataEvent} from '@klipper/bow/http/event/PushRequestDataEvent';
    import {PushRequestDataFunction} from '@klipper/bow/http/request/PushRequestDataFunction';
    import {DeleteRequestDataEvent} from '@klipper/bow/http/event/DeleteRequestDataEvent';
    import {DeleteRequestDataFunction} from '@klipper/bow/http/request/DeleteRequestDataFunction';
    import {Canceler} from '@klipper/http-client/Canceler';
    import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
    import {getRequestErrorMessage} from '@klipper/bow/utils/error';
    import {deepMerge} from '@klipper/bow/utils/object';
    import {replaceRouteQuery} from '@klipper/bow/routers/router';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KStandardView extends mixins(AjaxFormContent, SlotWrapper) {
        @Prop({type: Function})
        public fetchRequest!: FetchRequestDataFunction|undefined;

        @Prop({type: Function})
        public pushRequest!: PushRequestDataFunction|undefined;

        @Prop({type: Function})
        public deleteRequest!: DeleteRequestDataFunction|undefined;

        @Prop({type: Boolean, default: false})
        public loader!: boolean;

        @Prop({type: String, default: undefined})
        public metadata!: string;

        @Prop({type: Boolean, default: false})
        public disableStandardActions!: boolean;

        @Prop({type: Boolean, default: false})
        public disableLocaleActions!: boolean;

        private editMode: boolean = false;

        private data: Partial<any>|null = null;

        private backupData: Partial<any>|null = null;

        private selectedLocale: string|null = null;

        private newLocale: string|null = null;

        public get bindSlotData(): any {
            return {
                id: this.id,
                data: this.data,
                dataAvailableLocales: this.dataAvailableLocales,
                isCreate: this.isCreate,
                isTranslatable: this.isTranslatable,
                currentLocale: this.currentLocale,
                selectedLocale: this.selectedLocale,
                newLocale: this.newLocale,
                findSelectedLocale: this.findSelectedLocale,
                $form: this.$refs.form,
                editMode: this.editMode,
                toggleEdit: this.toggleEdit,
                enableEdit: this.enableEdit,
                cancelEdit: this.cancelEdit,
                loading: this.loading,
                fetchLoading: this.fetchLoading,
                pushLoading: this.pushLoading,
                showError: this.showError,
                errorCode: this.errorCode,
                errorMessage: this.errorMessage,
                fieldErrors: this.fieldErrors,
                refresh: this.refresh,
                push: this.push,
            };
        }

        public get isCreate(): boolean
        {
            return !this.$route.params.id || 'create' === this.$route.params.id;
        }

        public get id(): string|number|undefined {
            let id = this.data && this.data.id ? this.data.id : this.$route.params.id;

            return 'create' !== id ? id : undefined;
        }

        public get displayStandardActions(): boolean {
            return !!this.$scopedSlots.standardActionsPrepend
                || !!this.$scopedSlots.standardActions
                || !!this.$scopedSlots.standardActionsAppend
                || this.displayStandardEditAction
                || this.displayStandardDeleteAction
            ;
        }

        public get displayStandardEditAction(): boolean {
            return !!this.pushRequest && !this.isCreate;
        }

        public get displayStandardDeleteAction(): boolean {
            return !!this.deleteRequest && !this.isCreate;
        }

        public get fetchLoading(): boolean {
            return this.loading && !this.editMode;
        }

        public get pushLoading(): boolean {
            return this.loading && this.editMode;
        }

        public get showError(): boolean {
            return (this.loader && !this.data)
                || (!this.loader && !!this.previousError);
        }

        public get errorCode(): number {
            return this.previousError ? this.previousError.statusCode : 0;
        }

        public get errorMessage(): string {
            if (this.previousError) {
                let message = '';

                if (this.errorCode > 0) {
                    message = this.previousError.statusCode + ' ';
                }

                message += getRequestErrorMessage(this, this.previousError);

                return message;
            }

            return this.$t('error.404-page-not-found');
        }

        public get isMetadataInitialized(): boolean {
            return undefined === this.$store.state.metadata || this.$store.state.metadata.initialized;
        }

        public get isTranslatable(): string|undefined {
            return this.metadata && this.$metadata.isTranslatable(this.metadata);
        }

        public get dataAvailableLocales(): string[]|undefined {
            return this.data && this.data.available_locales ? this.data.available_locales : undefined
        }

        public get findSelectedLocale(): string|null {
            return this.isTranslatable && this.$route.query.lang ? this.$route.query.lang : null;
        }

        public get currentLocale(): string {
            return this.newLocale || this.selectedLocale || this.$store.state.i18n.locale;
        }

        public async created(): Promise<void> {
            this.selectedLocale = this.$route.query.lang ? this.$route.query.lang : null;
            await this.refresh();
        }

        public async mounted(): Promise<void> {
            window.addEventListener('keyup', this.keyDownHandler);
            this.selectedLocale = this.findSelectedLocale;
        }

        public async destroyed(): Promise<void> {
            window.removeEventListener('keyup', this.keyDownHandler);
            this.cancelEdit();
        }

        @Watch('isMetadataInitialized')
        public watchIsMetadataInitialized(value: boolean): void {
            if (value) {
                this.selectedLocale = this.isTranslatable ? this.findSelectedLocale : null;
            }
        }

        public async onLocaleChange(locale: string, newLocale?: boolean): Promise<void> {
            replaceRouteQuery({
                lang: locale !== this.$store.state.i18n.locale ? locale : undefined,
            }, this.$route);

            if (newLocale) {
                if (this.data && this.data.available_locales) {
                    this.data.available_locales.push(locale);
                    this.newLocale = locale;
                    this.enableEdit();
                }
            } else {
                this.selectedLocale = locale;
                await this.refresh();
            }
        }

        public async onLocaleDelete(locale: string): Promise<void> {
            if (this.deleteRequest && this.id) {
                const res = await this.fetchData(async (canceler) => {
                    await this.deleteItem(this.id, canceler, locale);

                    return true;
                }, true);

                if (res) {
                    await this.refresh();
                }
            }
        }

        public enableEdit(): void {
            this.editMode = true;
        }

        public cancelEdit(createRouterBack: boolean = false): void {
            if (this.isCreate && createRouterBack) {
                if (this.$routerBack) {
                    this.$routerBack.back();
                }

                return;
            }

            this.resetPreviousError();
            this.editMode = false;
            this.data = deepMerge({}, this.backupData);
            this.newLocale = null;

            replaceRouteQuery({
                lang: this.selectedLocale !== this.$store.state.i18n.locale ? this.selectedLocale : undefined,
            }, this.$route);
        }

        public toggleEdit(): void {
            if (this.editMode) {
                this.cancelEdit();
            } else {
                this.enableEdit();
            }
        }

        public keyDownHandler(event: KeyboardEvent): void {
            if (event.code === 'Escape' && this.editMode) {
                this.cancelEdit();
            } else if (event.shiftKey && event.altKey && event.code === 'KeyE') {
                this.toggleEdit();
            }
        }

        public async refresh(): Promise<void> {
            const id: string = this.$route.params.id;

            if (id && this.fetchRequest && !this.loading && !this.isCreate) {
                this.data = await this.fetchData(async (canceler) => {
                    const event = new FetchRequestDataEvent();
                    event.id = id;
                    event.canceler = canceler;
                    event.locale = this.selectedLocale || undefined;

                    return await this.fetchRequest(event);
                }, false);
                this.backupData = deepMerge({}, this.data);
            } else if (!id || this.isCreate) {
                this.data = {};
                this.backupData = {};
                this.enableEdit();
            }

            this.loading = false;

            if (this.selectedLocale
                && this.dataAvailableLocales
                && this.dataAvailableLocales.length > 0
                && this.dataAvailableLocales.indexOf(this.selectedLocale) < 0
            ) {
                this.selectedLocale = this.dataAvailableLocales[0];

                replaceRouteQuery({
                    lang: this.selectedLocale !== this.$store.state.i18n.locale ? this.selectedLocale : undefined,
                }, this.$route);
            }
        }

        public async push(): Promise<void> {
            if (this.pushRequest && !this.loading) {
                if (this.isValidForm()) {
                    const locale = this.newLocale || this.selectedLocale;

                    const res = await this.fetchData(async (canceler) => {
                        const event = new PushRequestDataEvent();
                        event.data = this.data;
                        event.canceler = canceler;
                        event.locale = locale !== this.$store.state.i18n.locale ? locale : undefined;

                        return await this.pushRequest(event);
                    }, false);

                    if (res) {
                        this.data = res;
                        this.backupData = deepMerge({}, this.data);
                        this.cancelEdit();

                        this.selectedLocale = locale;

                        replaceRouteQuery({
                            lang: this.selectedLocale !== this.$store.state.i18n.locale ? this.selectedLocale : undefined,
                        }, this.$route);
                    }
                }
            } else {
                this.cancelEdit();
            }

            this.loading = false;
        }

        public async deleteItem(id: string|number, canceler: Canceler, locale?: string): Promise<string|number|undefined> {
            if (this.deleteRequest && (!this.loading || !!locale) && !this.isCreate) {
                const event = new DeleteRequestDataEvent();
                event.id = id;
                event.canceler = canceler;
                event.locale = locale;

                await this.deleteRequest(event);

                return id;
            }
        }

        public onDeletedItem(id: string|number): void {
            this.$emit('deleted-item', id);
        }
    }
</script>
