<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-container fill-height>
        <k-error-message :message="$t('error.404-page-not-found')" :error-code="404">
            <v-btn depressed
                   rounded
                   small
                   color="primary lighten-2"
                   class="mt-5"
                   :to="{path: '/'}"
            >
                {{ $t('error.go-to-home') }}
            </v-btn>
        </k-error-message>
    </v-container>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api';
import {MetaInfo} from 'vue-meta';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default defineComponent({
    metaInfo(): MetaInfo {
        return {
            title: this.$t('error.404-page-not-found') as string,
        };
    },
});
</script>
