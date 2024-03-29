/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {ChildMetadata} from '@klipper/bow/metadata/ChildMetadata';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface FieldMetadata extends ChildMetadata {
    filterable: boolean;
    searchable: boolean;
    translatable: boolean;
}
