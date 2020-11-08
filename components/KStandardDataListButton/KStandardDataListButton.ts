/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Component, Prop, Vue} from 'vue-property-decorator';
import {Dictionary} from '@klipper/bow/generic/Dictionary';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KStandardDataListButton extends Vue {
    @Prop({type: String})
    public icon!: string;

    private get genButtonProps(): Dictionary<any> {
        return Object.assign({
            color: this.$color('accent', 'accent lighten-1'),
            depressed: true,
            ripple: true,
            rounded: true,
            small: true,
        }, this.$attrs);
    }
}
