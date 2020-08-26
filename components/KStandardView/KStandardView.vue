<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-fade-transition mode="out-in">
        <k-loading v-if="loading" class="mt-5"></k-loading>

        <k-error-message v-else-if="!data" :message="errorMessage">
            <v-btn depressed
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

        <div v-else>
            <v-row class="ma-0" align="center">
                <v-col class="flex-grow-1 ma-0 pa-0 d-flex align-center">
                    <slot name="header" :data="data"></slot>
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

            <slot name="default" :data="data"></slot>
        </div>
    </v-fade-transition>
</template>

<script lang="ts">
    import {Component, Prop} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {AjaxContent} from '../../mixins/http/AjaxContent';
    import {FetchRequestDataEvent} from '../../http/event/FetchRequestDataEvent';
    import {FetchRequestDataFunction} from '../../http/request/FetchRequestDataFunction';
    import {SlotWrapper} from '../../slot/mixins/SlotWrapper';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KStandardView extends mixins(AjaxContent, SlotWrapper) {
        @Prop({type: Function, required: true})
        public fetchRequest: FetchRequestDataFunction;

        private data: Partial<any>|null = null;

        public get errorMessage(): string {
            if (this.previousError && 404 !== this.previousError.statusCode) {
                return this.previousError.statusCode + ' ' + this.previousError.message;
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
