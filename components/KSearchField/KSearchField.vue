<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-text-field
            flat
            solo-inverted
            hide-details
            clearable
            prepend-inner-icon="search"
            :label="$t('search')"
            v-model="search"
            color="accent lighten-2"
            rounded
    ></v-text-field>
</template>

<script lang="ts">
    import {Component, Prop, Watch, Vue} from 'vue-property-decorator';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KSearchField extends Vue {
        public search: string = '';

        @Prop({type: String, required: true})
        public prefix!: string;

        public async created(): Promise<void> {
            this.$root.$on(this.prefix + '-in', async (searchValue: string) => {
                this.search = searchValue;
            });

            this.$root.$on(this.prefix + '-refresh', async () => {
                this.$root.$emit(this.prefix + '-out', this.search);
            });
        }

        public destroyed() {
            this.$root.$off(this.prefix + '-in');
            this.$root.$off(this.prefix + '-refresh');
        }

        @Watch('search')
        public searchRequest(searchValue?: string): void {
            this.$root.$emit(this.prefix + '-out', searchValue);
        }

        public refresh(): void {
            this.$root.$emit(this.prefix + '-request-refresh');
        }
    }
</script>