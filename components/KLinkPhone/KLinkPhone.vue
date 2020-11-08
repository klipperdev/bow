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
            <v-btn
                :href="telLink"
                small
                icon
                depressed
                :color="iconColor"
                class="ml-2 mt-n1"
            >
                <v-icon
                    small
                >
                    fa fa-fw fa-phone
                </v-icon>
            </v-btn>
        </slot>

        <slot
            v-if="!!src && smsIcon"
            name="sms-icon"
            :src="src"
            :href="smsLink"
            :iconColor="iconColor"
        >
            <v-btn
                :href="smsLink"
                small
                icon
                depressed
                :color="iconColor"
                class="ml-2 mt-n1"
            >
                <v-icon
                    small
                >
                    fa fa-fw fa-sms
                </v-icon>
            </v-btn>
        </slot>

        <slot
            v-if="!!src && faxIcon"
            name="fax-icon"
            :src="src"
            :href="faxLink"
            :iconColor="iconColor"
        >
            <v-btn
                :href="faxLink"
                small
                icon
                depressed
                :color="iconColor"
                class="ml-2 mt-n1"
            >
                <v-icon
                    small
                >
                    fa fa-fw fa-fax
                </v-icon>
            </v-btn>
        </slot>

        <span
            v-if="!src"
        >
            {{ defaultValue }}
        </span>
    </span>
</template>
