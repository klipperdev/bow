/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import _Vue, {PluginObject} from 'vue';
import {Formatter} from './Formatter';

/**
 * Formatter vue plugin.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default class VueFormatter implements PluginObject<Formatter> {
    private readonly formatter: Formatter;

    constructor(formatter?: Formatter) {
        this.formatter = formatter || new Formatter();
    }

    public install(Vue: typeof _Vue): void {
        const self = this;
        Vue.prototype.$formatter = this.formatter;

        Vue.prototype.$fd = (value?: string, format?: string): string|undefined => {
            return self.formatter.date(value, format);
        };

        Vue.prototype.$ft = (value?: string, format?: string): string|undefined => {
            return self.formatter.time(value, format);
        };

        Vue.prototype.$fdt = (value?: string, format?: string): string|undefined => {
            return self.formatter.dateTime(value, format);
        };
    }
}
