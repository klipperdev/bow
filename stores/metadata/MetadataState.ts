/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {MapKey} from '@klipper/http-client/models/MapKey';
import {ObjectMetadata} from '../../metadata/ObjectMetadata';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface MetadataState {
    initialized: boolean;
    initializationPending: boolean;
    metadatas: MapKey<ObjectMetadata>;
}
