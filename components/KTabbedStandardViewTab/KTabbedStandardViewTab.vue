<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-tab-item
        v-bind="genProps"
        v-on="$listeners"
    >
        <slot
            v-if="noContainer"
            name="default"
        />

        <v-container
            v-else
            v-bind="genContainerProps"
        >
            <slot name="default"/>
        </v-container>
    </v-tab-item>
</template>

<script lang="ts">
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {inject as RegistrableInject} from '@klipper/bow/mixins/Registrable';
import {StandardViewItem} from '@klipper/bow/mixins/StandardViewItem';
import {StandardViewTab} from '@klipper/bow/standardView/StandardViewTab';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component({
    inheritAttrs: false,
})
export default class KTabbedStandardViewTab extends mixins(
    StandardViewItem,
    RegistrableInject<'standardViewTab', any>('standardViewTab'),
) implements StandardViewTab {
    @Prop({required: true})
    public label: string;

    @Prop({required: true})
    public name: string;

    @Prop({default: null})
    public count!: number|null;

    @Prop({default: false})
    public disabled!: boolean;

    @Prop({default: false})
    public noContainer!: boolean;

    @Prop({default: false})
    public fluid!: boolean;

    @Prop({type: Boolean, default: false})
    public eager!: boolean;

    @Prop({default: false})
    public creatable!: boolean;

    @Prop({type: Object, default: () => {
            return {};
        }})
    public containerProps!: Dictionary<any>;

    @Prop({default: false})
    public transition!: boolean;

    private customCount: number|null = null;

    public get isCountable(): boolean {
        return null !== this.customCount || null !== this.count;
    }

    public get isCreatable(): boolean {
        return false !== (this.creatable as boolean|string);
    }

    public get genCount(): number {
        return this.customCount ?? this.count ?? 0;
    }

    public setCount(count: number|null): void {
        this.customCount = count;
    }

    private get genContainerProps(): Dictionary<any> {
        return Object.assign({
            fluid: this.fluid,
        }, this.containerProps);
    }

    private get genProps(): Dictionary<any> {
        return Object.assign({
            transition: this.transition,
            eager: this.eager,
        }, this.$attrs);
    }
}
</script>
