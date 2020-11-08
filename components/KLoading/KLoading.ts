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
export default class KLoading extends Vue {
    @Prop({type: Boolean, default: false})
    public value!: boolean;

    @Prop({type: String, default: null})
    public message!: string|null;

    @Prop({type: String, default: 'accent'})
    public progressColor!: string;

    @Prop({type: Boolean, default: false})
    public fullscreen!: boolean;

    @Prop({type: Number, default: 46})
    public size!: number;

    @Prop({type: Number, default: 4})
    public width!: number;
}
