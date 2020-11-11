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
export default class KOnlineStatus extends Vue {
    @Prop({type: Boolean, default: true})
    public onlyOffline: boolean;

    private online?: boolean = false;

    public beforeMount(): void {
        this.online = window.navigator.onLine;
        window.addEventListener('online', this.onOnline);
        window.addEventListener('offline', this.onOffline);
    }

    public destroyed(): void {
        window.removeEventListener('online', this.onOnline);
        window.removeEventListener('offline', this.onOffline);
    }

    private onOnline(): void {
        this.online = true;
    }

    private onOffline(): void {
        this.online = false;
    }
}
