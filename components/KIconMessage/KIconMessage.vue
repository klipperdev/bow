<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-row
        align="center"
        justify="center"
    >
        <k-wall-message
            :message="message"
        >
            <template v-slot:icon>
                <v-icon
                    :size="iconSize"
                    :color="iconColor"
                >
                    {{ icon }}
                </v-icon>
            </template>

            <template v-slot:default>
                <slot name="default"/>
            </template>
        </k-wall-message>
    </v-row>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KIconMessage extends Vue {
    @Prop({type: String, required: true})
    public message!: string;

    @Prop({type: String, required: true})
    public icon!: string;

    @Prop({type: String, default: '12em'})
    public iconSize!: string;

    @Prop({type: String, default: ''})
    public iconColor!: string;
}
</script>
