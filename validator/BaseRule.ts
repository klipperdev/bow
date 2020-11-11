/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Rule} from '@klipper/bow/validator/Rule';
import {RuleOptions} from '@klipper/bow/validator/RuleOptions';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export abstract class BaseRule<O extends RuleOptions = RuleOptions> implements Rule {
    public readonly options: O;

    public constructor(options?: O) {
        this.options = options || {} as O;
    }

    public getOptions(): O {
        return this.options;
    }

    public abstract validate(value?: any): boolean|string;

    /**
     * Get the error message.
     *
     * @param {string} defaultMessage The default message
     *
     * @return {string}
     */
    protected getMessage(defaultMessage: string): string {
        return this.options.message ? this.options.message : defaultMessage;
    }
}
