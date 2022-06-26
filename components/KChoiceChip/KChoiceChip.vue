<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-chip
        v-if="!!choice"
        :color="$oc(genChoice).color(genDefaultColor)"
        dark
        v-bind="$attrs"
        v-on="$listeners"
        :class="genClasses"
    >
        <slot
            name="default"
            v-bind="genSlotProps"
        >
            <slot
                name="inner-prepend"
                v-bind="genSlotProps"
            />

            <slot
                name="icon"
                v-bind="genSlotProps"
            >
                <v-icon
                    v-if="!noIcon && $oc(genChoice).icon()"
                    left
                    dark
                    :size="iconSize"
                    :small="undefined === iconSize && !$attrs.small"
                    :x-small="undefined === iconSize && ($attrs.small || $attrs['x-small'])"
                >
                    {{ $oc(genChoice).icon() }}
                </v-icon>
            </slot>

            <slot
                name="label"
                v-bind="genSlotProps"
            >
                {{ genLabel }}
            </slot>

            <slot
                name="inner-append"
                v-bind="genSlotProps"
            />
        </slot>
    </v-chip>

    <span
        v-else
    >
        {{ defaultLabel }}
    </span>
</template>

<script lang="ts">
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {Themeable} from '@klipper/bow/mixins/Themeable';
import {mergeMapClasses} from '@klipper/bow/utils/style';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KChoiceChip extends mixins(
    Themeable,
) {
    @Prop({type: String, default: undefined})
    public defaultColor!: string;

    @Prop({type: String, default: '~'})
    public defaultLabel!: string;

    @Prop()
    public choice!: Dictionary<any>|string|undefined;

    @Prop({type: Function, default: undefined})
    public choiceText!: ((choice: object|string|undefined) => string)|undefined;

    @Prop({type: Boolean, default: false})
    public block!: boolean;

    @Prop({type: Boolean, default: false})
    public noIcon!: boolean;

    @Prop({type: [Number, String], default: undefined})
    public iconSize!: string|number;

    private get genDefaultColor(): string {
        if (this.defaultColor) {
            return this.defaultColor;
        }

        return this.isDark ? 'accent' : 'accent';
    }

    private get genChoice(): Dictionary<any> {
        return typeof this.choice === 'object' ? this.choice : {};
    }

    private get genLabel(): string {
        if (!!this.choiceText) {
            return this.choiceText(this.choice);
        }

        return typeof this.choice === 'string' ? this.choice : this.choice?.label;
    }

    private get genSlotProps(): Dictionary<any> {
        return {
            defaultColor: this.defaultColor,
            defaultLabel: this.defaultLabel,
            choice: this.choice,
            choiceText: this.choiceText,
            noIcon: this.noIcon,
            block: this.block,
            label: this.genLabel,
        };
    }

    private get genClasses(): Dictionary<boolean> {
        return mergeMapClasses(
            {
                'mt-n1': true,
                'v-chip--block': this.block,
            },
            !!this.$vnode.data ? this.$vnode.data.class : undefined,
            this.$attrs.class,
        );
    }
}
</script>
