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
export default class KStandardHeaderButton extends Vue {
    @Prop({type: String})
    public icon!: string;

    private get genButtonProps(): Dictionary<any> {
        return Object.assign({
            color: undefined === this.$attrs.color ? 'primary' : this.$attrs.color,
            depressed: this.idsDepressed(),
            ripple: true,
            rounded: true,
            small: true,
        }, this.$attrs);
    }

    private idsDepressed(): boolean {
        return undefined === this.$attrs.depressed
            && undefined === this.$attrs.fab
            && undefined === this.$attrs.icon
            && undefined === this.$attrs.link
            && undefined === this.$attrs.outlined
            && undefined === this.$attrs.shaped
            && undefined === this.$attrs.text
        ;
    }
}
