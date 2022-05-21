<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-dialog
        v-if="fullscreen"
        v-model="value"
        persistent
        fullscreen
        hide-overlay
        transition=""
    >
        <v-card
            class="fill-height"
        >
            <v-container
                fluid
                fill-height
            >
                <v-row
                    align="center"
                    justify="center"
                >
                    <v-progress-circular
                        indeterminate
                        :size="size"
                        :width="width"
                        :color="progressColor"
                    />

                    <h1
                        v-if="message != null">
                        {{message}}
                    </h1>
                </v-row>
            </v-container>
        </v-card>
    </v-dialog>

    <v-container
        v-else
        fill-height
    >
        <v-row
            align="center"
            justify="center"
        >
            <v-progress-circular
                indeterminate
                :size="size"
                :width="width"
                :color="progressColor"
            />

            <h1 v-if="message != null"
            >
                {{message}}
            </h1>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KLoading extends Vue {
    @Prop({type: Boolean, default: false})
    public value!: boolean;

    @Prop({type: String, default: null})
    public message!: string|null;

    @Prop({type: String, default: 'accent'})
    public progressColor!: string;

    @Prop({type: Boolean, default: false})
    public fullscreen!: boolean;

    @Prop({type: Number, default: 46})
    public size!: number;

    @Prop({type: Number, default: 4})
    public width!: number;
}
</script>
