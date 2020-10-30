/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {BaseRule} from '@klipper/bow/validator/BaseRule';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class UrlRule extends BaseRule {
    public static getName(): string {
        return 'url';
    }

    public validate(value?: any): boolean|string {
        if (!value) {
            return true;
        }

        let re = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/;

        if (this.options.withHttp) {
            re = /https?:\/\/[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/;
        }

        return re.test(value) || this.getMessage('This value is not a URL');
    }
}
