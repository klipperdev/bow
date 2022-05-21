<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <k-export-action
        v-bind="genButtonProps"
        v-on="$listeners"
    />
</template>

<script lang="ts">
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {Component, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KStandardHeaderButtonExport extends Vue {
    private get genButtonProps(): Dictionary<any> {
        return Object.assign({
            color: undefined === this.$attrs.color ? 'primary' : this.$attrs.color,
            depressed: this.isDepressed(),
            ripple: true,
            rounded: true,
            small: true,
        }, this.$attrs);
    }

    private isDepressed(): boolean {
        return undefined === this.$attrs.depressed
            && undefined === this.$attrs.fab
            && undefined === this.$attrs.icon
            && undefined === this.$attrs.link
            && undefined === this.$attrs.outlined
            && undefined === this.$attrs.shaped
            && undefined === this.$attrs.text
        ;
    }
}
</script>
