<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-fade-transition mode="out-in">
        <k-loading v-if="loading" class="mt-5"></k-loading>

        <k-error-message v-else-if="!data" :message="$t('error.404-page-not-found')">
            <v-btn depressed
                   rounded
                   small
                   :color="$color('primary lighten-4', 'primary lighten-3')"
                   class="mt-5"
                   :to="{path: '/'}"
            >
                {{ $t('error.go-to-home') }}
            </v-btn>
        </k-error-message>

        <div v-else>
            <v-row class="ma-0" align="center">
                <v-col cols="10" class="ma-0 pa-0">
                    <slot name="header" :data="data"></slot>
                </v-col>
                <v-col cols="2" class="text-right">
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
    import {MetaInfo} from 'vue-meta';
    import {AjaxContent} from '../../http/mixins/AjaxContent';
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

        public get isMetadataInitialized(): boolean {
            return undefined === this.$store.state.metadata || this.$store.state.metadata.initialized;
        }

        public metaInfo(): MetaInfo {
            return {
                title: this.$metadata.getLabel('account') as string,
            };
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
