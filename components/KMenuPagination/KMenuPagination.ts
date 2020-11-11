/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {Themeable} from '@klipper/bow/mixins/Themeable';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KMenuPagination extends mixins(Themeable) {
    @Prop({type: Number, required: true})
    public page!: number;

    @Prop({type: Number, required: true})
    public limit!: number;

    @Prop({type: Number, required: true})
    public pages!: number;

    @Prop({type: Number, required: true})
    public total!: number;

    @Prop({type: Boolean, default: false})
    public disabled!: boolean;

    private get classes(): Dictionary<boolean> {
        return {
            'k-menu-pagination': true,
            'mt-1': true,
            'mb-1': true,
            'text-center': true,
            ...this.themeClasses,
        };
    }

    private get bindSlotData(): Dictionary<any> {
        return {
            page: this.page,
            limit: this.limit,
            pages: this.pages,
            total: this.total,
            disabled: this.disabled,
        };
    }
}
