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
export class RangeRule extends BaseRule<RangeRuleOptions> {
    public static getName(): string {
        return 'range';
    }

    public validate(value?: any): boolean|string {
        if (typeof value !== 'string' && typeof value !== 'number') {
            return true;
        }

        if (typeof value === 'string') {
            value = parseFloat(value);
        }

        if (isNaN(value)) {
            return true;
        }

        if (undefined !== this.options.min && undefined !== this.options.max) {
            if (value < this.options.min || value > this.options.max) {
                return this.getMessage('This value should be between {min} and {max}');
            }
        } else if (undefined !== this.options.min) {
            if (value < this.options.min) {
                return this.getMessage('This value should be {min} or more');
            }
        } else if (undefined !== this.options.max) {
            if (value > this.options.max) {
                return this.getMessage('This value should be {max} or less.');
            }
        }

        return true;
    }
}
