/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {RuleOptions} from './RuleOptions';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface Rule {
    /**
     * Validate the value.
     */
    validate(value?: any): boolean|string;

    /**
     * Get the options of the rule.
     */
    getOptions(): RuleOptions;
}

/**
 * Interface of constructor.
 */
export interface RuleConstructor<R extends RuleOptions = RuleOptions> {
    new(options?: R): Rule;

    /**
     * Get the name of rule.
     *
     * @return {string}
     */
    getName(): string;
}
