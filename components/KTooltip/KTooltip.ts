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
export default class KTooltip extends Vue {
    @Prop({type: String, default: 'fade'})
    public transition: string;

    @Prop({type: String, default: 'top'})
    public position: string;

    @Prop({type: String, default: '.'})
    public message: string;

    private hover: boolean = false;

    private get classes(): Dictionary<boolean> {
        return {
            'k-tooltip': true,
            'k-tooltip--top': this.position === 'top',
            'k-tooltip--bottom': this.position === 'bottom',
            'k-tooltip--left': this.position === 'left',
            'k-tooltip--right': this.position === 'right',
        };
    }
}
