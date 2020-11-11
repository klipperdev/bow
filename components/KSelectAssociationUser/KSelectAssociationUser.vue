<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KSelectAssociationUser.ts" />

<template>
    <k-select-association
        ref="select"
        v-bind="selectAttrs"
        v-on="$listeners"
    >
        <template v-slot:selection="{item}">
            <k-user-avatar
                :size="selectedAvatarSize"
                vertical-adjust
                label
                :user="item"
            />
        </template>

        <template v-slot:item="{item}">
            <k-user-avatar
                :size="listAvatarSize"
                vertical-adjust
                label
                :user="item"
            />
        </template>

        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]="props">
            <slot :name="slotItem.original" v-bind="props"/>
        </template>
    </k-select-association>
</template>
