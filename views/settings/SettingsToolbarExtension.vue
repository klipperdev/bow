<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-tabs v-model="tab"
            ref="settingsTabs"
            align-with-title
            show-arrows
            :color="$store.state.darkMode.enabled ? 'primary lighten-3' : 'primary'"
    >
        <v-tab v-for="item in items"
               :key="item.name"
               :to="item.to"
        >
            {{ item.label }}
        </v-tab>
    </v-tabs>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';

    /**
     *
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class SettingsToolbarExtension extends Vue {
        private tab: string|null = null;

        public get items(): any[] {
            const currentContext = this.$store.getters['account/getContext'];
            const tabs = [];

            for (const route of (this.$router as any).options.routes) {
                if (route.children && true === route.meta.settings) {
                    for (const subRoute of route.children) {
                        if (undefined === subRoute.meta) {
                            continue;
                        }

                        const title = typeof subRoute.meta.title === 'function' ? subRoute.meta.title(this) : subRoute.meta.title;

                        if (title && (!subRoute.meta.context
                                || (Array.isArray(subRoute.meta.context)
                                    && subRoute.meta.context.includes(currentContext)))) {
                            tabs.push({
                                name: subRoute.name,
                                label: subRoute.meta.translatable
                                    ? this.$t(title)
                                    : title,
                                to: {name: subRoute.name, params: {org: this.$org}},
                            });
                        }
                    }

                    break;
                }
            }

            return tabs;
        }

        @Watch('items')
        public watchItems(): void {
            if (this.$refs.settingsTabs) {
                this.$refs.settingsTabs.onResize();
            }
        }
    }
</script>
