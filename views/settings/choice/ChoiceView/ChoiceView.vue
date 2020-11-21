<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./ChoiceView.ts" />

<template>
    <v-container>
        <k-standard-view
            metadata="choice"
            @created="$router.replace({name: 'settings-choice', params: {id: $oc($event).id()}})"
            @deleted="$router.replace({name: 'settings-choices'})"
        >
            <template v-slot:header>
                <k-standard-view-title-icon icon="fa-fw fa-list-alt"/>
                <k-standard-view-title :prefix="$ml('choice')"/>
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
                        <k-standard-view-field-text name="color"/>
                    </v-row>
                </k-standard-view-section>

                <k-standard-view-section-system/>
            </template>
        </k-standard-view>
    </v-container>
</template>
