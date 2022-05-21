<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <k-standard-view
        metadata="choice"
        @created="self.$router.replace({name: 'settings-choice', params: {id: self.$oc($event).id()}})"
        @deleted="self.$router.replace({name: 'settings-choices'})"
    >
        <template v-slot:header>
            <k-standard-view-title :prefix="self.$ml('choice')"/>
        </template>

        <template v-slot:card="{data}">
            <k-standard-view-section locked>
                <v-row>
                    <k-standard-view-field-text name="type" autofocus/>
                </v-row>

                <v-row>
                    <k-standard-view-field-text name="label"/>
                    <k-standard-view-field-text name="value"/>
                </v-row>

                <v-row>
                    <k-standard-view-field-number name="position" :scale="0"/>
                    <k-standard-view-field-icon
                        name="icon"
                        :view-props="{
                            color: self.$oc(data).color()
                        }"
                    />
                </v-row>

                <v-row>
                    <k-col-spacer/>
                    <k-standard-view-field-color name="color"/>
                </v-row>
            </k-standard-view-section>

            <k-standard-view-section-system/>
        </template>
    </k-standard-view>
</template>

<script lang="ts">
import {Selfable} from '@klipper/bow/mixins/Selfable';
import {mixins} from 'vue-class-component';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class ChoiceView extends mixins(
    Selfable,
) {
}
</script>
