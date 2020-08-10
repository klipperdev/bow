<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <k-upload :inline="false"
              :disabled="!apiUploadSrc"
              :endpoint="apiUploadSrc || ''"
              :allowed-file-types="allowedFileTypes"
              @complete="onUploadComplete"
    >
        <template v-slot:default="{inline, open}">

            <v-hover :class="classes" :style="styles">
                <template v-slot:default="{hover}">
                    <v-avatar :size="size"
                              :rounded="rounded"
                              :tile="tile"
                              color="grey"
                    >
                        <v-fade-transition mode="out-in">
                            <k-img mode="cover" :api-src="apiSrc" v-if="!!apiSrc">
                                <template v-slot:placeholder>
                                    <v-icon :size="iconSize">fa fw fa-user</v-icon>
                                </template>
                            </k-img>

                            <v-icon v-else :size="iconSize">fa fw fa-user</v-icon>
                        </v-fade-transition>

                        <v-fade-transition>
                            <v-overlay absolute
                                       v-if="!!apiUploadSrc && hover"
                            >
                                <v-btn
                                    outlined
                                    small
                                    fab
                                    ripple
                                    icon
                                    @click="open">
                                    <v-icon>camera_alt</v-icon>
                                </v-btn>
                            </v-overlay>
                        </v-fade-transition>
                    </v-avatar>
                </template>
            </v-hover>
        </template>
    </k-upload>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KUploadableImg extends Vue {
        @Prop({type: String, default: null})
        public apiSrc!: string|null;

        @Prop({type: String, default: null})
        public apiUploadSrc!: string|null;//TODO

        @Prop({type: Boolean, default: false})
        public rounded!: boolean;

        @Prop({type: Boolean, default: false})
        public tile!: boolean;

        @Prop({type: Number, default: 48})
        public size!: number;

        public get classes(): object {
            return {
                'k-uploadable-img': true,
            };
        }

        public get styles(): string {
            return {
                'width': this.size + 'px',
                'min-width': this.size + 'px',
                'height': this.size + 'px',
            };
        }

        public get iconSize(): number|undefined {
            return this.size ? (Math.round(this.size / 2)) : undefined
        }

        public get allowedFileTypes(): string[] {
            return ['image/*', '.jpg', '.jpeg', '.png', '.tif', '.tiff', '.gif', '.svg', '.webp'];
        }

        public onUploadComplete(result: any): void {
            this.$emit('complete', result);
        }
    }
</script>
