<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KLinkPhone.ts" />

<template>
    <span
        class="k-link-phone"
    >
        <a
            v-if="!!src"
            v-bind="$attrs"
            v-on="$listeners"
            :href="aLink"
        >
            <slot
                name="default"
                :src="src"
                :href="aLink"
            >
                {{ src }}
            </slot>
        </a>

        <slot
            v-if="!!src && telIcon"
            name="icon"
            :src="src"
            :href="telLink"
            :iconColor="iconColor"
        >
            <k-btn-helper
                :href="telLink"
                :color="iconColor"
                icon="fa fa-fw fa-phone"
            />
        </slot>

        <slot
            v-if="!!src && smsIcon"
            name="sms-icon"
            :src="src"
            :href="smsLink"
            :iconColor="iconColor"
        >
            <k-btn-helper
                :href="smsLink"
                :color="iconColor"
                icon="fa fa-fw fa-sms"
            />
        </slot>

        <slot
            v-if="!!src && faxIcon"
            name="fax-icon"
            :src="src"
            :href="faxLink"
            :iconColor="iconColor"
        >
            <k-btn-helper
                :href="faxLink"
                :color="iconColor"
                icon="fa fa-fw fa-fax"
            />
        </slot>

        <span
            v-if="!src"
        >
            {{ defaultValue }}
        </span>
    </span>
</template>
