/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component({
    inheritAttrs: false,
})
export default class KSelectAssociationChoice extends Vue {
    @Prop({type: String, required: true})
    public type!: string;

    private get selectAttrs(): Dictionary<any> {
        return Object.assign({
            'target-metadata': 'choice',
            'item-text': 'label',
            'item-value': 'value',
            'fields': ['position', 'color'],
            'sort': ['position:asc', 'label:asc'],
            'filters': {field: 'type', operator: 'equal', value: this.type},
        }, this.$attrs);
    }
}
