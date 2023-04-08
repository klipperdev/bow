/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {BaseRule} from '@klipper/bow/validator/BaseRule';
import {RangeRuleOptions} from '@klipper/bow/validator/rules/RangeRuleOptions';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class NumberRule extends BaseRule<RangeRuleOptions> {
    public static getName(): string {
        return 'number';
    }

    public validate(value?: any): boolean|string {
        if (('' === value || typeof value !== 'string') && typeof value !== 'number') {
            return true;
        }

        if (typeof value === 'string') {
            value = parseFloat(value);
        }

        if (!isNaN(value) && (typeof value === 'number' || typeof value === 'bigint')) {
            return true;
        }

        return this.getMessage('This value is not a number');
    }
}
