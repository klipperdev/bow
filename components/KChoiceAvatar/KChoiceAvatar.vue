<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KChoiceAvatar.ts" />

<template>
    <v-avatar
        :id="'choiceAvatar_' + self._uid"
        rounded
        :size="size"
        :color="self.$oc(choice).color(defaultColor)"
    >
        <span
            class="white--text"
            :style="'font-size: ' + labelSize + ';'"
        >
            <slot
                name="default"
                :label="self.$oc(choice).label()"
                :default-label="defaultLabel"
            >
                {{ labelContent }}
            </slot>
        </span>

        <v-tooltip
            :activator="'#choiceAvatar_' + self._uid"
            :left="left"
            :right="right"
            :top="!top && !bottom && !left && !right ? true : top"
            :bottom="bottom"
            :nudge-left="left ? tooltipNudge : 0"
            :nudge-right="right ? tooltipNudge : 0"
            :nudge-top="top ? tooltipNudge : 0"
            :nudge-bottom="bottom ? tooltipNudge : 0"
            :open-delay="tooltipOpenDelay"
            :disabled="tooltipDisabled"
            :transition="tooltipTransitionValue"
            :color="self.$oc(choice).color(defaultColor)"
        >
            <slot
                name="tooltip"
                :tooltip="tooltipContent"
                :label="self.$oc(choice).label()"
                :default-label="defaultLabel"
            >
                <span>
                    {{ tooltipContent }}
                </span>
            </slot>
        </v-tooltip>
    </v-avatar>
</template>
