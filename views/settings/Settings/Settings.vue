<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <router-view
        name="default"
    />
</template>

<script lang="ts">
import {MetaInfo} from 'vue-meta';
import {Component, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class Settings extends Vue {
    public metaInfo(): MetaInfo {
        return {
            title: this.$t('views.settings.title') as string,
        };
    }
}
</script>
