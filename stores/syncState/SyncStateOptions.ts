/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface SyncStateOptions<S = Dictionary<any>> {
    statesPaths?: string[];
    namespaceSuffix?: string|((state: S, options: SyncStateOptions<S>) => string);
    namespacedModules?: string[];
    key?: string;
}
