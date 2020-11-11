/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {BaseRule} from '@klipper/bow/validator/BaseRule';
import {LengthRuleOptions} from '@klipper/bow/validator/rules/LengthRuleOptions';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class LengthRule extends BaseRule<LengthRuleOptions> {
    public static getName(): string {
        return 'length';
    }

    public validate(value?: any): boolean|string {
        if (undefined !== this.options.min && (value || '').length < this.options.min) {
            return this.getMessage('This value must be contains {min} characters minimal');
        }

        if (undefined !== this.options.max && (value || '').length > this.options.max) {
            return this.getMessage('This value must be contains {max} characters maximal');
        }

        return true;
    }
}
