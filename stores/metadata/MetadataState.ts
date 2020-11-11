/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {ObjectMetadata} from '@klipper/bow/metadata/ObjectMetadata';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface MetadataState {
    initialized: boolean;
    initializationPending: boolean;
    metadatas: Dictionary<ObjectMetadata>;
}
