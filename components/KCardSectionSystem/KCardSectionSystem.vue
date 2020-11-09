<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KCardSectionSystem.ts" />

<template>
    <k-card-section
        :title="$t('system.info')"
        dense
        close
        v-bind="$attrs"
        v-on="$listeners"
    >
        <slot
            name="prepend"
            v-bind="bindSlotData"
        />

        <v-row
            v-if="timestamp"
        >
            <k-col-label
                :label="$mfl(metadata, 'created_at')"
                :empty="!loading && !$oc(data).created_at()"
            >
                {{ $datetime($oc(data).created_at()) }}
            </k-col-label>

            <k-col-label
                :label="$mfl(metadata, 'updated_at')"
                :empty="!loading && !$oc(data).updated_at()"
            >
                {{ $datetime($oc(data).updated_at()) }}
            </k-col-label>
        </v-row>

        <v-row
            v-if="userTrack"
        >
            <k-col-label
                :label="$mal(metadata, 'created_by')"
                :empty="!loading && !$oc(data).created_by()"
            >
                <k-user-avatar
                    v-if="userAvatar"
                    :size="userAvatarSize"
                    vertical-adjust
                    label
                    :user="$oc(data).created_by()"
                />

                <template v-else>
                    {{ $oc(data).created_by.full_name('~') }}
                </template>
            </k-col-label>

            <k-col-label
                :label="$mal(metadata, 'updated_by')"
                :empty="!loading && !$oc(data).updated_by()"
            >
                <k-user-avatar
                    v-if="userAvatar"
                    :size="userAvatarSize"
                    vertical-adjust
                    label
                    :user="$oc(data).updated_by()"
                />

                <template v-else>
                    {{ $oc(data).updated_by.full_name('~') }}
                </template>
            </k-col-label>
        </v-row>

        <slot
            name="append"
            v-bind="bindSlotData"
        />

        <slot
            name="default"
            v-bind="bindSlotData"
        />
    </k-card-section>
</template>
