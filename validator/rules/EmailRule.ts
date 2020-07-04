/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {BaseRule} from '../BaseRule';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class EmailRule extends BaseRule {
    public static getName(): string {
        return 'email';
    }

    public validate(value?: any): boolean|string {
        if (!value) {
            return true;
        }

        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return re.test(value) || this.getMessage('This value is not an address email');
    }
}
