/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import iconData from '@klipper/bow/assets/animations/errorIcon.json';
import iconServerData from '@klipper/bow/assets/animations/errorServerIcon.json';
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KErrorMessage extends Vue {
    @Prop({type: String, required: true})
    public message!: string;

    @Prop({type: Number, default: 0})
    public errorCode!: number;

    private get iconData(): object {
        switch (this.errorCode) {
            case 404:
                return iconData;
            default:
                return iconServerData;
        }
    }

    private get iconSize(): string {
        switch (this.errorCode) {
            case 404:
                return '600px';
            default:
                return '350px';
        }
    }
}
