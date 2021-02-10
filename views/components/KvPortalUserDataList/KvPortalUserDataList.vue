<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KvPortalUserDataList.ts" />

<template>
    <k-standard-data-list
        v-bind="$attrs"
        v-on="$listeners"
        :headers="headers"
        :fetch-request="fetchRequest"
        metadata="portal_user"
        no-import
    >
        <template v-slot:data-table.item.image="{item}">
            <k-user-avatar
                :size="38"
                right
                :user="item.user"
                :tooltip="false"
            />
        </template>

        <template v-slot:data-table.item.name="{item}">
            {{ $oc(item).user.full_name($oc(item).user.username()) }}
        </template>

        <template v-slot:data-table.item.enabled="{item}">
            <k-checkbox :value="item.enabled"/>
        </template>

        <template v-slot:data-table.item.updated_at="{item}">
            <k-datetime :value="$oc(item).updated_at()"/>
        </template>

        <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope" />
        </template>
    </k-standard-data-list>
</template>
