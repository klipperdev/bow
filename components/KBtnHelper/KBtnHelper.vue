<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-btn
        v-bind="$attrs"
        v-on="$listeners"
        small
        icon
        text
        class="ml-2 mt-n1"
        :color="color"
    >
        <v-icon small>
            {{ icon }}
        </v-icon>
    </v-btn>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KBtnHelper extends Vue {
    @Prop({type: String, required: true})
    public icon: string;

    @Prop({type: String, default: 'primary'})
    public color: string;
}
</script>
