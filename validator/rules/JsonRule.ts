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
export class JsonRule extends BaseRule {
    public static getName(): string {
        return 'json';
    }

    public validate(value?: any): boolean|string {
        let res = true;

        try {
            if (!!value) {
                JSON.parse(value);
            }
        } catch (e) {
            res = false;
        }

        return res || this.getMessage('This value is not a valid JSON');
    }
}
