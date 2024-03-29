/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import Vue from 'vue';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
interface Data {
    online: boolean,
}

export const OnlineCheckable = Vue.extend<Data, {}, {}>({
    name: 'onlineCheckable',

    data() {
        return {
            online: false as boolean,
        };
    },

    methods: {
        onOnline(): void {
            this.online = true;
        },

        onOffline(): void {
            this.online = false;
        },
    },

    beforeMount(): void {
        this.online = undefined !== window.navigator.onLine ? window.navigator.onLine : true;
        window.addEventListener('online', this.onOnline);
        window.addEventListener('offline', this.onOffline);
    },

    destroyed(): void {
        window.removeEventListener('online', this.onOnline);
        window.removeEventListener('offline', this.onOffline);
    },
});
