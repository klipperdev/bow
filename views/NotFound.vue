<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-container fill-height>
        <k-error-message :message="$t('error.404-page-not-found')">
            <v-btn depressed
                   rounded
                   small
                   :color="$color('primary lighten-4', 'primary lighten-3')"
                   class="mt-5"
                   :to="{path: '/'}"
            >
                {{ $t('error.go-to-home') }}
            </v-btn>
        </k-error-message>
    </v-container>
</template>

<script lang="ts">
    import {MetaInfo} from 'vue-meta';
    import {Component, Vue} from 'vue-property-decorator';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class NotFound extends Vue {
        public metaInfo(): MetaInfo {
            return {
                title: this.$t('error.404-page-not-found') as string,
            };
        }
    }
</script>
