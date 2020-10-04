<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-fade-transition mode="out-in">
        <k-loading v-if="loader && fetchLoading" class="mt-5"></k-loading>

        <k-error-message v-else-if="showError" :message="errorMessage" :error-code="this.errorCode">
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
                    <slot name="header"
                          :data="data"
                          :loading="loading"
                          :fetchLoading="fetchLoading"
                          :pushLoading="pushLoading"
                          :showError="showError"
                          :errorCode="errorCode"
                          :enableEdit="enableEdit"
                          :cancelEdit="cancelEdit"
                          :refresh="refresh"
                          :push="push"
                          :editMode="editMode"
                          :fieldErrors="fieldErrors"
                    ></slot>
                </v-col>
                <v-col class="flex-grow-0 flex-shrink-1 text-right">
                    <slot name="header-actions"
                          :data="data"
                          :loading="loading"
                          :fetchLoading="fetchLoading"
                          :pushLoading="pushLoading"
                          :showError="showError"
                          :errorCode="errorCode"
                          :enableEdit="enableEdit"
                          :cancelEdit="cancelEdit"
                          :refresh="refresh"
                          :push="push"
                          :editMode="editMode"
                          :fieldErrors="fieldErrors"
                    >
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

            <slot name="default"
                  :data="data"
                  :loading="loading"
                  :fetchLoading="fetchLoading"
                  :pushLoading="pushLoading"
                  :showError="showError"
                  :errorCode="errorCode"
                  :enableEdit="enableEdit"
                  :cancelEdit="cancelEdit"
                  :refresh="refresh"
                  :push="push"
                  :editMode="editMode"
                  :fieldErrors="fieldErrors"
            >
                <v-form ref="form" @submit.prevent>
                    <v-card flat>
                        <v-fade-transition mode="out-in">
                            <v-tabs centered
                                    v-if="editMode"
                                    key="edit"
                            >
                                <v-btn text @click="cancelEdit" :disabled="loading">
                                    {{ $t('cancel')}}
                                </v-btn>

                                <v-btn depressed color="accent" :disabled="fetchLoading" :loading="pushLoading" @click="push">
                                    {{ $t('save')}}
                                </v-btn>
                            </v-tabs>

                            <v-tabs centered
                                    v-else-if="!!$scopedSlots.standardActions"
                                    key="view"
                            >
                                <slot name="standardActionsPrepend"
                                      :data="data"
                                      :loading="loading"
                                      :fetchLoading="fetchLoading"
                                      :pushLoading="pushLoading"
                                      :showError="showError"
                                      :errorCode="errorCode"
                                      :enableEdit="enableEdit"
                                      :cancelEdit="cancelEdit"
                                      :refresh="refresh"
                                      :push="push"
                                      :editMode="editMode"
                                      :fieldErrors="fieldErrors"
                                ></slot>
                                <slot name="standardActions"
                                      :data="data"
                                      :loading="loading"
                                      :fetchLoading="fetchLoading"
                                      :pushLoading="pushLoading"
                                      :showError="showError"
                                      :errorCode="errorCode"
                                      :enableEdit="enableEdit"
                                      :cancelEdit="cancelEdit"
                                      :refresh="refresh"
                                      :push="push"
                                      :editMode="editMode"
                                      :fieldErrors="fieldErrors"
                                ></slot>
                                <slot name="standardActionsAppend"
                                      :data="data"
                                      :loading="loading"
                                      :fetchLoading="fetchLoading"
                                      :pushLoading="pushLoading"
                                      :showError="showError"
                                      :errorCode="errorCode"
                                      :enableEdit="enableEdit"
                                      :cancelEdit="cancelEdit"
                                      :refresh="refresh"
                                      :push="push"
                                      :editMode="editMode"
                                      :fieldErrors="fieldErrors"
                                ></slot>
                            </v-tabs>
                        </v-fade-transition>

                        <slot name="card"
                              :data="data"
                              :loading="loading"
                              :fetchLoading="fetchLoading"
                              :pushLoading="pushLoading"
                              :showError="showError"
                              :errorCode="errorCode"
                              :enableEdit="enableEdit"
                              :cancelEdit="cancelEdit"
                              :refresh="refresh"
                              :push="push"
                              :editMode="editMode"
                              :fieldErrors="fieldErrors"
                        ></slot>

                        <v-fade-transition mode="out-in">
                            <v-tabs centered
                                    v-if="editMode"
                                    key="edit"
                            >
                                <v-btn text @click="cancelEdit" :disabled="loading">
                                    {{ $t('cancel')}}
                                </v-btn>

                                <v-btn depressed color="accent" :disabled="fetchLoading" :loading="pushLoading" @click="push">
                                    {{ $t('save')}}
                                </v-btn>
                            </v-tabs>

                            <v-tabs centered
                                    v-else-if="!!$scopedSlots.standardActions"
                                    key="view"
                            >
                                <slot name="standardActionsPrepend"
                                      :data="data"
                                      :loading="loading"
                                      :fetchLoading="fetchLoading"
                                      :pushLoading="pushLoading"
                                      :showError="showError"
                                      :errorCode="errorCode"
                                      :enableEdit="enableEdit"
                                      :cancelEdit="cancelEdit"
                                      :refresh="refresh"
                                      :push="push"
                                      :editMode="editMode"
                                      :fieldErrors="fieldErrors"
                                ></slot>
                                <slot name="standardActions"
                                      :data="data"
                                      :loading="loading"
                                      :fetchLoading="fetchLoading"
                                      :pushLoading="pushLoading"
                                      :showError="showError"
                                      :errorCode="errorCode"
                                      :enableEdit="enableEdit"
                                      :cancelEdit="cancelEdit"
                                      :refresh="refresh"
                                      :push="push"
                                      :editMode="editMode"
                                      :fieldErrors="fieldErrors"
                                ></slot>
                                <slot name="standardActionsAppend"
                                      :data="data"
                                      :loading="loading"
                                      :fetchLoading="fetchLoading"
                                      :pushLoading="pushLoading"
                                      :showError="showError"
                                      :errorCode="errorCode"
                                      :enableEdit="enableEdit"
                                      :cancelEdit="cancelEdit"
                                      :refresh="refresh"
                                      :push="push"
                                      :editMode="editMode"
                                      :fieldErrors="fieldErrors"
                                ></slot>
                            </v-tabs>
                        </v-fade-transition>
                    </v-card>
                </v-form>

                <slot name="lists"
                      :data="data"
                      :loading="loading"
                      :fetchLoading="fetchLoading"
                      :pushLoading="pushLoading"
                      :showError="showError"
                      :errorCode="errorCode"
                      :enableEdit="enableEdit"
                      :cancelEdit="cancelEdit"
                      :refresh="refresh"
                      :push="push"
                      :editMode="editMode"
                      :fieldErrors="fieldErrors"
                ></slot>
            </slot>
        </k-loader-wrapper>
    </v-fade-transition>
</template>

<script lang="ts">
    import {Component, Prop} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {AjaxFormContent} from '@klipper/bow/mixins/http/AjaxFormContent';
    import {FetchRequestDataEvent} from '@klipper/bow/http/event/FetchRequestDataEvent';
    import {FetchRequestDataFunction} from '@klipper/bow/http/request/FetchRequestDataFunction';
    import {PushRequestDataEvent} from '@klipper/bow/http/event/PushRequestDataEvent';
    import {PushRequestDataFunction} from '@klipper/bow/http/request/PushRequestDataFunction';
    import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
    import {getRequestErrorMessage} from '@klipper/bow/utils/error';
    import {deepMerge} from '@klipper/bow/utils/object';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KStandardView extends mixins(AjaxFormContent, SlotWrapper) {
        @Prop({type: Function})
        public fetchRequest!: FetchRequestDataFunction|undefined;

        @Prop({type: Function})
        public pushRequest!: PushRequestDataFunction|undefined;

        @Prop({type: Boolean, default: false})
        public loader!:boolean

        private editMode: boolean = false;

        private data: Partial<any>|null = null;

        private backupData: Partial<any>|null = null;

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

        public async created(): Promise<void> {
            await this.refresh();
        }

        public async mounted(): Promise<void> {
            window.addEventListener('keyup', this.keyDownHandler);
        }

        public async destroyed(): Promise<void> {
            window.removeEventListener('keyup', this.keyDownHandler);
            this.cancelEdit();
        }

        public enableEdit(): void {
            this.editMode = true;
        }

        public cancelEdit(): void {
            this.editMode = false;
            this.data = deepMerge({}, this.backupData);
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

            if (id && this.fetchRequest && !this.loading) {
                this.data = await this.fetchData(async (canceler) => {
                    const event = new FetchRequestDataEvent();
                    event.id = id;
                    event.canceler = canceler;

                    return await this.fetchRequest(event);
                }, false);
                this.backupData = deepMerge({}, this.data);
            }

            this.loading = false;
        }

        public async push(): Promise<void> {
            if (this.pushRequest && !this.loading) {
                if (this.isValidForm()) {
                    this.data = await this.fetchData(async (canceler) => {
                        const event = new PushRequestDataEvent();
                        event.data = this.data;
                        event.canceler = canceler;

                        return await this.pushRequest(event);
                    }, false);

                    this.backupData = deepMerge({}, this.data);
                    this.cancelEdit();
                }
            } else {
                this.cancelEdit();
            }

            this.loading = false;
        }
    }
</script>
