/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KStandardViewTitleIcon extends Vue {
    @Prop({type: String, required: true})
    public icon: boolean;

    @Prop({type: Number, default: 30})
    public iconSize: number;

    @Prop({type: String, default: 'primary'})
    public color: string;
}
