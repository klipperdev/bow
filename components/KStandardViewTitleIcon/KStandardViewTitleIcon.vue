<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-icon
        v-bind="$attrs"
        v-on="$listeners"
        class="mr-2"
        :style="genStyle"
        :size="genIconSize"
        :color="color"
    >
        {{ icon }}
    </v-icon>
</template>

<script lang="ts">
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KStandardViewTitleIcon extends Vue {
    @Prop({type: String, required: true})
    public icon!: string;

    @Prop({type: Number, default: 30})
    public iconSize: number;

    @Prop({type: String, default: 'accent'})
    public color: string;

    private get genIconSize(): number {
        return this.icon.startsWith('fa-') ? Math.round(this.iconSize * 0.85) : this.iconSize;
    }

    private get genStyle(): Dictionary<string> {
        return {
            width: this.iconSize + 'px',
            height: this.iconSize + 'px',
        };
    }
}
</script>
