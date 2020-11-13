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
import {extractIdentifier, extractIdentifiers} from '@klipper/bow/utils/object';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class AssociationDataModelTransformer implements DataModelTransformer {
    public async transform<D, T>(event: DataTransformerEvent<D, T>): Promise<void> {
        for (const metaAsso of Object.values(event.objectMetadata.associations)) {
            if (undefined !== (event.dataTransformed as any)[metaAsso.name]) {
                const field = metaAsso.inputConfig.name_path || event.objectMetadata.fieldIdentifier;

                if (['many-to-many', 'one-to-many'].includes(metaAsso.type)) {
                    (event.dataTransformed as any)[metaAsso.name] = extractIdentifiers(
                        field,
                        (event.dataTransformed as any)[metaAsso.name],
                    );
                } else {
                    (event.dataTransformed as any)[metaAsso.name] = extractIdentifier(
                        field,
                        (event.dataTransformed as any)[metaAsso.name],
                        null,
                    );
                }
            }
        }
    }
}
