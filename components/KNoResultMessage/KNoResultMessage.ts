/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import iconData from '@klipper/bow/assets/animations/searchNoResult.json';
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KNoResultMessage extends Vue {
    @Prop({type: String, required: false})
    public message!: string;

    @Prop({type: Boolean, default: false})
    public dense!: boolean;

    protected get iconData(): object {
        return  iconData;
    }

    private get resultMessage(): string {
        return this.message || this.$t('no-result') as string;
    }
}
