<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-fade-transition mode="out-in">
        <k-loading v-if="loader && loading" class="mt-5"></k-loading>

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

        <k-loader-wrapper :loading="loading" v-else>
            <v-row class="ma-0" align="center">
                <v-col class="flex-grow-1 ma-0 pa-0 d-flex align-center">
                    <slot name="header" :data="data" :loading="loading"></slot>
                </v-col>
                <v-col class="flex-grow-0 flex-shrink-1 text-right">
                    <slot name="header-actions" :data="data">
                        <v-btn :color="$color('primary', 'primary lighten-2')"
                               depressed
                               ripple
                               rounded
                               small
                               @click="refresh()"
                        >
                            <v-icon small>refresh</v-icon>
                        </v-btn>
                    </slot>
                </v-col>
            </v-row>

            <slot name="default" :data="data" :loading="loading"></slot>
        </k-loader-wrapper>
    </v-fade-transition>
</template>

<script lang="ts">
    import {Component, Prop} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {AjaxContent} from '@klipper/bow/mixins/http/AjaxContent';
    import {FetchRequestDataEvent} from '@klipper/bow/http/event/FetchRequestDataEvent';
    import {FetchRequestDataFunction} from '@klipper/bow/http/request/FetchRequestDataFunction';
    import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
    import {getRequestErrorMessage} from '@klipper/bow/utils/error';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KStandardView extends mixins(AjaxContent, SlotWrapper) {
        @Prop({type: Function, required: true})
        public fetchRequest: FetchRequestDataFunction;

        @Prop({type: Boolean, default: false})
        public loader!:boolean

        private data: Partial<any>|null = null;

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

        public async refresh(): Promise<void> {
            const id: string = this.$route.params.id;

            if (id) {
                this.data = await this.fetchData(async (canceler) => {
                    const event = new FetchRequestDataEvent();
                    event.id = id;
                    event.canceler = canceler;

                    return await this.fetchRequest(event);
                }, false);
            }

            this.loading = false;
        }
    }
</script>
