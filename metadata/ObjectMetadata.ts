/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {MapKey} from '@klipper/http-client/models/MapKey';
import {FieldMetadata} from './FieldMetadata';
import {AssociationMetadata} from './AssociationMetadata';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface ObjectMetadata {
    name: string;
    pluralName: string;
    label: string;
    pluralLabel: string;
    sortable: boolean;
    multiSortable: boolean;
    defaultSortable: string[];
    filterable: boolean;
    searchable: boolean;
    translatable: boolean;
    availableContexts: string[];
    fieldIdentifier: string;
    fieldLabel: string;
    editablePermissions: boolean;
    master: boolean;
    availableActions: string[];
    fields: MapKey<FieldMetadata>;
    associations: MapKey<AssociationMetadata>;
}
