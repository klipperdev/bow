<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-list rounded dense>
        <slot name="prepend"></slot>

        <v-tooltip right
                   open-delay="120"
                   :disabled="!$store.state.drawer.mini"
                   nudge-right="8"
                   eager
                   transition="slide-x-transition"
                   :color="$store.state.darkMode.enabled ? 'primary lighten-2' : 'primary lighten-1'"
        >
            <template v-slot:activator="{on, attrs}">
                <v-list-item v-on="on"
                             :to="{name: 'account-settings', params: {'org': $org}}"
                             active-class="primary white--text white--icon"
                             @click.stop=""
                >
                    <v-list-item-icon>
                        <v-icon dense>
                            fa fa-user-cog
                        </v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>
                            {{ $t('views.settings.title') }}
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </template>
            <span>{{ $t('views.settings.title') }}</span>
        </v-tooltip>

        <slot name="default"></slot>
    </v-list>
</template>

<script lang="ts">
    import {Component} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {SlotWrapper} from '../../slot/mixins/SlotWrapper';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KDrawerSectionSettings extends mixins(SlotWrapper) {
    }
</script>
