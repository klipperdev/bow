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
export default class KLinkEmail extends Vue {
    @Prop({type: String})
    public src!: string|undefined;

    @Prop({type: String, default: '~'})
    public defaultValue!: string;

    @Prop({type: Boolean, default: false})
    public icon: boolean;

    @Prop({type: [String, Object], default: 'accent'})
    public iconColor: string|object;

    @Prop({type: String})
    public emailCc!: string|undefined;

    @Prop({type: String})
    public emailBcc!: string|undefined;

    @Prop({type: String})
    public emailSubject!: string|undefined;

    @Prop({type: String})
    public emailBody!: string|undefined;

    private get emailLink(): string|undefined {
        return undefined !== this.src ? 'mailto:' + this.src + this.getLinkQueries() : undefined;
    }

    private getLinkQueries(): string {
        let query = '';

        if (!!this.emailCc) {
            query += '&cc=' + encodeURIComponent(this.emailCc);
        }

        if (!!this.emailBcc) {
            query += '&bcc=' + encodeURIComponent(this.emailBcc);
        }

        if (!!this.emailSubject) {
            query += '&subject=' + encodeURIComponent(this.emailSubject);
        }

        if (!!this.emailBody) {
            query += '&body=' + encodeURIComponent(this.emailBody + '\n\n');
        }

        if (!!query) {
            query = '?' + query.replace(/^&/, '');
        }

        return query;
    }
}
