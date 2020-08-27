/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {RuleConstructor} from '@klipper/bow/validator/Rule';

/**
 * Interface for the map.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface MapRule<V extends RuleConstructor = RuleConstructor> {
    [key: string]: V;
}
