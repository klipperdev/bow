/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {RuleOptions} from './RuleOptions';
import {Rule} from './Rule';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export abstract class BaseRule implements Rule {
    public readonly options: RuleOptions;

    public constructor(options?: RuleOptions) {
        this.options = options || {};
    }

    public getOptions(): RuleOptions {
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
