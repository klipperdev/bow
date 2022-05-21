<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-list
        rounded
        dense
    >
        <slot
            name="prepend"
        />

        <v-list-item
            :id="'drawerSectionSettings_' + self._uid"
            :to="{name: 'settings', params: {'org': self.$org}}"
            active-class="primary white--text white--icon"
            @click.stop=""
        >
            <v-list-item-icon>
                <v-icon
                    dense
                >
                    fa-fw fa-cog
                </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
                <v-list-item-title>
                    {{ $t('views.settings.title') }}
                </v-list-item-title>
            </v-list-item-content>

            <v-tooltip
                :activator="'#drawerSectionSettings_' + self._uid"
                right
                open-delay="120"
                :disabled="tooltipDisabled"
                nudge-right="8"
                transition="slide-x-transition"
                :color="self.$store.state.darkMode.enabled ? 'primary lighten-2' : 'primary lighten-1'"
            >
                <span>
                    {{ $t('views.settings.title') }}
                </span>
            </v-tooltip>
        </v-list-item>

        <slot
            name="default"
        />
    </v-list>
</template>

<script lang="ts">
import {Selfable} from '@klipper/bow/mixins/Selfable';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {mixins} from 'vue-class-component';
import {Component, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KDrawerSectionSettings extends mixins(
    Selfable,
    SlotWrapper,
) {
    private tooltipDisabled: boolean = false;

    private get mini(): boolean {
        return this.$store && this.$store.state.drawer ? this.$store.state.drawer.mini : false;
    }

    public mounted(): void {
        this.watchMini(this.mini);
    }

    @Watch('mini')
    private watchMini(mini: boolean): void {
        this.tooltipDisabled = !mini;
    }
}
</script>
