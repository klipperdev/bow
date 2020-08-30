<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div v-bind="$attrs" v-on="$listeners">
        <slot name="default" :loading="loading"></slot>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {provide as RegistrableProvide} from '@klipper/bow/mixins/Registrable';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component({
        inheritAttrs: false,
    })
    export default class KLoaderWrapper extends mixins(RegistrableProvide('loaderWrapper')) {
        @Prop({type: Boolean, default: false})
        public loading: boolean;

        private components: Vue[] = [];

        public register(component: Vue): void {
            if (typeof component['setLoading'] === 'function') {
                this.components.push(component);
                (component as any).setLoading(this.loading);
            }
        }

        public unregister(item: Vue): void {
            const found = this.components.find(i => (i as any)._uid === (item as any)._uid);

            if (!found) {
                return;
            }

            this.components = this.components.filter(i => (i as any)._uid !== (item as any)._uid);
        }

        @Watch('loading')
        public async watchLoading(loading: boolean): Promise<void> {
            for (const i in this.components) {
                (this.components[i] as any).setLoading(loading);
            }
        }
    }
</script>
