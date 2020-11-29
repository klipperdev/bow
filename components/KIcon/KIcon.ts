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
@Component
export default class KIcon extends Vue {
    @Prop({type: [String, Number]})
    public value!: string|number;

    @Prop({type: String, default: '~'})
    public defaultValue!: string;

    private get genProps(): Dictionary<any> {
        return Object.assign({
            icon: undefined === this.$attrs.icon ? true : this.$attrs.icon,
        }, this.$attrs);
    }
}
