/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import {mixins} from 'vue-class-component';
import {provide as RegistrableProvide} from '@klipper/bow/mixins/Registrable';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component({
    inheritAttrs: false,
})
export default class KLoaderWrapper extends mixins(
    RegistrableProvide('loaderWrapper'),
) {
    @Prop({type: Boolean, default: false})
    public loading: boolean;

    private components: Vue[] = [];

    public register(component: Vue): void {
        if (typeof (component as any).setLoading === 'function') {
            this.components.push(component);
            (component as any).setLoading(this.loading);
        }
    }

    public unregister(component: Vue): void {
        if (this.components.find((i: Vue) => i._uid === component._uid)) {
            this.components = this.components.filter((i: Vue) => i._uid !== component._uid);
        }
    }

    @Watch('loading')
    private async watchLoading(loading: boolean): Promise<void> {
        this.components.forEach((component: any) => {
            component.setLoading(loading);
        });
    }
}
