<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div
        class="k-image-avatar"
    >
        <slot
            v-if="loading"
            name="loading"
        >
            <div
                class="k-user-avatar-skeleton-loader"
            >
                <v-skeleton-loader
                    type="avatar"
                    :width="size"
                    :height="size"
                    :class="imgClasses"
                    :style="imgStyles"
                />
            </div>
        </slot>

        <v-avatar
            v-else
            v-bind="genAvatarProps"
            v-on="$listeners"
            :class="imgClasses"
            :style="imgStyles"
            :size="size"
            :color="color"
        >
            <k-img
                :api-src="imageUrl"
                :key="imageUrl"
                :mode="mode"
            >
                <template v-slot:placeholder>
                    <slot
                        name="placeholder"
                        :size="genIconSize"
                        :src="imageUrl"
                    >
                        <v-icon
                            :size="genIconSize"
                            :color="colorIcon"
                        >
                            {{ icon }}
                        </v-icon>
                    </slot>
                </template>

                <template v-slot:default="{loaded}">
                    <slot
                        v-if="!loaded"
                        name="placeholder"
                        :size="genIconSize"
                        :src="imageUrl"
                    >
                        <v-icon
                            :size="genIconSize"
                            :color="colorIcon"
                        >
                            {{ icon }}
                        </v-icon>
                    </slot>
                </template>
            </k-img>
        </v-avatar>
    </div>
</template>

<style lang="scss" src="./KImageAvatar.scss" />

<script lang="ts">
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {mergeMapClasses} from '@klipper/bow/utils/style';
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KImageAvatar extends Vue {
    @Prop({type: String})
    public src!: string;

    @Prop({type: Number, default: 48})
    public size!: number;

    @Prop({type: Number, default: undefined})
    public iconSize!: number;

    @Prop({type: String, default: 'fa-fw fa-image'})
    public icon!: string;

    @Prop({type: String, default: 'blue-grey lighten-5'})
    public color!: string;

    @Prop({type: String, default: 'blue-grey lighten-3'})
    public colorIcon!: string;

    @Prop({type: Boolean, default: false})
    public loading!: boolean;

    @Prop({type: [String, Object]})
    public imgClass!: string|Dictionary<boolean>|undefined;

    @Prop({type: Object})
    public imgStyle!: Dictionary<any>|undefined;

    @Prop({type: [String, Boolean]})
    public verticalAdjust!: string|boolean|undefined;

    @Prop({type: String})
    public mode?: string;

    private get imgClasses(): Dictionary<boolean> {
        return mergeMapClasses({}, this.imgClass);
    }

    private get imgStyles(): Dictionary<string> {
        const styles = {} as any;

        if ('' === this.verticalAdjust) {
            styles.marginTop = Math.floor(this.size / 6) * -1 + 'px';
        } else if (this.verticalAdjust) {
            styles.marginTop = this.verticalAdjust as string;
        }

        return Object.assign(styles, this.imgStyle);
    }

    private get imageUrl(): string|undefined {
        return this.src
            ? this.src
            : undefined;
    }

    private get genIconSize(): number {
        return this.iconSize || Math.round(this.size / 2);
    }

    private get genAvatarProps(): Dictionary<any> {
        return Object.assign({
            rounded: undefined !== this.$attrs.rounded ? this.$attrs.rounded : true,
        }, this.$attrs || {});
    }
}
</script>
