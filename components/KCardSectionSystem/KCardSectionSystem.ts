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
@Component({
    inheritAttrs: false,
})
export default class KCardSectionSystem extends Vue {
    @Prop({type: String, required: true})
    public metadata!: string;

    @Prop({type: Object})
    public data!: object|undefined;

    @Prop({type: Boolean, default: true})
    public timestamp!: boolean;

    @Prop({type: Boolean, default: true})
    public userTrack!: boolean;

    @Prop({type: Boolean, default: true})
    public userAvatar!: boolean;

    @Prop({type: Number, default: 24})
    public userAvatarSize!: number;

    @Prop({type: Boolean, default: false})
    public loading!: boolean;

    private get bindSlotData(): any {
        return {
            metadata: this.metadata,
            timestamp: this.timestamp,
            userTrack: this.userTrack,
            userAvatar: this.userAvatar,
            userAvatarSize: this.userAvatarSize,
        };
    }
}
