<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-chip
        v-if="chip"
        v-bind="genChipProps"
    >
        <slot name="prepend"/>
        <k-text :value="genLabel"/>
        <slot name="append"/>
    </v-chip>

    <router-link
        v-else-if="!!genTo"
        v-bind="$attrs"
        v-on="$listeners"
        :to="genTo"
    >
        <slot name="prepend"/>
        <k-text :value="genLabel"/>
        <slot name="append"/>
    </router-link>

    <k-text
        v-else
        v-bind="$attrs"
        v-on="$listeners"
        :value="genLabel"
    />
</template>

<script lang="ts">
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {getPropertyFromItem} from '@klipper/bow/utils/object';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KLinkAssociation extends mixins(
    SlotWrapper,
) {
    @Prop()
    public value!: Dictionary<any>;

    @Prop({type: String, default: '~'})
    public defaultValue!: string;

    @Prop({type: [String, Function], default: undefined})
    public label!: ((data: Dictionary<any>|undefined) => string|undefined)|string|undefined;

    @Prop({type: String, default: undefined})
    public route!: string;

    @Prop({type: String, default: undefined})
    public routeIdentifier!: string;

    @Prop({type: String, default: 'id'})
    public fieldIdentifier!: string;

    @Prop({type: String, default: 'id'})
    public fieldLabel!: string;

    @Prop({type: Boolean, default: false})
    public routeAddRedirect!: boolean;

    @Prop({type: Boolean, default: false})
    public chip!: boolean;

    @Prop({type: Object, default: undefined})
    public chipProps!: Dictionary<any>;

    private get genIdentifier(): string|undefined {
        return !!this.value
            ? getPropertyFromItem(this.value, this.fieldIdentifier)
            : undefined;
    }

    private get genLabel(): string {
        if (this.label) {
            const value = typeof this.label === 'function' ? this.label(this.value) : this.label;

            if (value) {
                return value;
            }
        }

        let label = this.defaultValue;

        if (!!this.value) {
            let value = getPropertyFromItem(this.value, this.fieldLabel);

            if (!value) {
                value = getPropertyFromItem(this.value, this.fieldIdentifier);
            }

            if (!!value) {
                label = value;
            }
        }

        return label;
    }

    private get genTo(): Dictionary<any>|undefined {
        const routeIdentifier = this.routeIdentifier || this.fieldIdentifier;

        if (this.routeAddRedirect) {
            return !!this.route && !!this.genIdentifier
                ? this.$routeAddRedirect({name: this.route, params: {org: this.$org, [routeIdentifier]: this.genIdentifier}})
                : undefined;
        }

        return !!this.route && !!this.genIdentifier
            ? {name: this.route, params: {org: this.$org, [routeIdentifier]: this.genIdentifier}}
            : undefined;
    }

    private get genChipProps(): Dictionary<any>|undefined {
        return Object.assign({
            to: this.genTo,
        }, this.chipProps || {});
    }
}
</script>
