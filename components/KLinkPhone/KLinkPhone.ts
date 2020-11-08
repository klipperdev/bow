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
export default class KLinkPhone extends Vue {
    @Prop({type: String, default: 'tel'})
    public type!: string;

    @Prop({type: String})
    public src!: string|undefined;

    @Prop({type: String, default: '~'})
    public defaultValue!: string;

    @Prop({type: Boolean, default: false})
    public telIcon: boolean;

    @Prop({type: Boolean, default: false})
    public smsIcon: boolean;

    @Prop({type: Boolean, default: false})
    public faxIcon: boolean;

    @Prop({type: [String, Object], default: 'accent'})
    public iconColor: string|object;

    @Prop({type: String})
    public smsBody!: string|undefined;

    private get aLink(): string|undefined {
        switch (this.type) {
            case 'fax':
                return this.faxLink;
            case 'sms':
                return this.smsLink;
            case 'tel':
            default:
                return this.telLink;
        }
    }

    private get telLink(): string|undefined {
        return undefined !== this.src ? 'tel:' + this.src.replace(/ /g, '') : undefined;
    }

    private get smsLink(): string|undefined {
        return undefined !== this.src
            ? 'sms:' + this.src.replace(/ /g, '') + (this.smsBody ? '?body=' + encodeURIComponent(this.smsBody) : '')
            : undefined;
    }

    private get faxLink(): string|undefined {
        return undefined !== this.src ? 'fax:' + this.src.replace(/ /g, '') : undefined;
    }
}
