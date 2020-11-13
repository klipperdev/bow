<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KStandardViewFieldAssociation.ts" />

<template>
    <k-col-label
        v-bind="genColLabelProps"
        v-on="genColLabelListeners"
    >
        <template v-slot:read>
            <span v-if="isMultiple && isEmpty">{{ defaultValue }}</span>

            <k-link-association
                v-else-if="!isMultiple"
                ref="read"
                v-bind="genViewProps"
                v-on="genViewListeners"
                :value="fieldValue"
                :default-value="defaultValue"
                :route="!route && fallbackRouteUseName ? name : route"
                :route-identifier="routeIdentifier"
                :field-identifier="itemValue"
                :field-label="itemText"
            >
                <template v-for="slotItem in getSlotItems('view')" v-slot:[slotItem.target]="props">
                    <slot :name="slotItem.original" v-bind="props"/>
                </template>
            </k-link-association>

            <k-link-association
                v-else
                ref="read"
                v-bind="genViewProps"
                v-on="genViewListeners"
                :value="item"
                :default-value="defaultValue"
                :route="!route && fallbackRouteUseName ? name : route"
                :route-identifier="routeIdentifier"
                :field-identifier="itemValue"
                :field-label="itemText"
                v-for="item in fieldValue"
                :key="typeof item === 'object' ? item[itemValue] : item"
            >
                <template v-for="slotItem in getSlotItems('view')" v-slot:[slotItem.target]="props">
                    <slot :name="slotItem.original" v-bind="props"/>
                </template>
            </k-link-association>
        </template>

        <template v-slot:edit>
            <k-form-association
                ref="edit"
                v-model="fieldValue"
                v-bind="genAssociationEditProps"
                v-on="genEditListeners"
            >
                <template v-for="slotItem in getSlotItems('form')" v-slot:[slotItem.target]="props">
                    <slot :name="slotItem.original" v-bind="props"/>
                </template>
            </k-form-association>
        </template>

        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]="props">
            <slot :name="slotItem.original" v-bind="props"/>
        </template>
    </k-col-label>
</template>
