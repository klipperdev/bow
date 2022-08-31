/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {DataModelTransformer} from '@klipper/bow/dataTransformer/DataModelTransformer';
import {DataTransformerEvent} from '@klipper/bow/dataTransformer/event/DataTransformerEvent';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {extractIdentifier, extractIdentifiers} from '@klipper/bow/utils/object';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class AssociationDataModelTransformer implements DataModelTransformer {
    public async transform<D extends Dictionary<any>, T extends Dictionary<any>>(event: DataTransformerEvent<D, T>): Promise<void> {
        for (const childMeta of Object.values(event.objectMetadata.associations)) {
            if (undefined !== (event.dataTransformed as any)[childMeta.name]) {
                const field = childMeta.inputConfig.name_path || event.objectMetadata.fieldIdentifier;

                if (['many-to-many', 'one-to-many'].includes(childMeta.type)) {
                    (event.dataTransformed as any)[childMeta.name] = extractIdentifiers(
                        field,
                        (event.dataTransformed as any)[childMeta.name],
                    );
                } else {
                    (event.dataTransformed as any)[childMeta.name] = extractIdentifier(
                        field,
                        (event.dataTransformed as any)[childMeta.name],
                        null,
                    );
                }
            }
        }
    }
}
