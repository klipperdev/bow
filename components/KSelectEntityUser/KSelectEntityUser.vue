<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KSelectEntityUser.ts" />

<template>
    <k-select-entity
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

        <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
            <slot
                :name="slot"
                v-bind="scope"
            />
        </template>
    </k-select-entity>
</template>
