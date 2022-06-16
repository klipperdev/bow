<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <k-upload
        :inline="false"
        :disabled="!apiUploadSrc || disabled"
        :endpoint="apiUploadSrc || ''"
        :allowed-file-types="allowedFileTypes"
        @complete="onUploadComplete"
    >
        <template v-slot:default="{inline, open}">
            <v-hover
                :class="classes"
                :style="styles"
                :disabled="disabled"
            >
                <template v-slot:default="{hover}">
                    <v-avatar
                        :size="size"
                        :rounded="rounded"
                        :tile="tile"
                        :color="color"
                    >
                        <v-fade-transition
                            mode="out-in"
                        >
                            <k-img
                                v-if="!!apiSrc"
                                :mode="mode"
                                :api-src="apiSrc"
                                :key="apiSrc"
                            >
                                <template v-slot:placeholder>
                                    <v-icon
                                        :size="iconSize"
                                    >
                                        {{ icon }}
                                    </v-icon>
                                </template>
                            </k-img>

                            <v-icon
                                v-else
                                :size="iconSize"
                            >
                                {{ icon }}
                            </v-icon>
                        </v-fade-transition>

                        <v-fade-transition>
                            <v-overlay
                                v-if="!!apiUploadSrc && hover"
                                absolute
                            >
                                <v-btn
                                    outlined
                                    small
                                    fab
                                    ripple
                                    icon
                                    @click="open"
                                >
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
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KUploadableImg extends Vue {
    @Prop({type: String, default: null})
    public apiSrc!: string|null;

    @Prop({type: String, default: null})
    public apiUploadSrc!: string|null;

    @Prop({type: Boolean, default: false})
    public disabled!: boolean;

    @Prop({type: Boolean, default: false})
    public rounded!: boolean;

    @Prop({type: Boolean, default: false})
    public tile!: boolean;

    @Prop({type: Number, default: 48})
    public size!: number;

    @Prop({type: String, default: 'grey'})
    public color!: string;

    @Prop({type: String, default: 'fa-fw fa-image'})
    public icon!: string;

    @Prop({type: String, default: 'cover'})
    public mode!: string;

    protected get allowedFileTypes(): string[] {
        return ['image/*', '.jpg', '.jpeg', '.png', '.tif', '.tiff', '.gif', '.svg', '.webp'];
    }

    protected get classes(): Dictionary<boolean> {
        return {
            'k-uploadable-img': true,
        };
    }

    private get styles(): Dictionary<string> {
        return {
            'width': this.size + 'px',
            'min-width': this.size + 'px',
            'height': this.size + 'px',
        };
    }

    private get iconSize(): number|undefined {
        return this.size ? (Math.round(this.size / 2)) : undefined;
    }

    private onUploadComplete(result: any): void {
        this.$emit('complete', result);
    }
}
</script>
