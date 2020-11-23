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
export default class KStandardViewButton extends Vue {
    @Prop({type: String})
    public icon!: string;

    private get genButtonProps(): Dictionary<any> {
        return Object.assign({
            depressed: true,
            ripple: true,
            color: 'primary',
        }, this.$attrs);
    }
}
