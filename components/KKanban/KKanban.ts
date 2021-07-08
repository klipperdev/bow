/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {provide as RegistrableProvide} from '@klipper/bow/mixins/Registrable';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {mixins} from 'vue-class-component';
import {Component, Vue, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component({
    inheritAttrs: false,
})
export default class KKanban extends mixins(
    SlotWrapper,
    RegistrableProvide('kanban'),
) {
    @Prop({type: Object})
    public contentProps!: Dictionary<any>|undefined;

    private columns: Vue[] = [];

    private get genSlotProps(): Dictionary<any> {
        return {
            columns: this.columns,
        };
    }

    public register(item: Vue): void {
        if (!this.columns.find((i: Vue) => i._uid === item._uid)) {
            this.columns.push(item);
        }
    }

    public unregister(item: Vue): void {
        if (this.columns.find((i: Vue) => i._uid === item._uid)) {
            this.columns = this.columns.filter((i: Vue) => i._uid !== item._uid);
        }
    }
}
