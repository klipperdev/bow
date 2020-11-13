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
export class FieldEntityChoiceDataModelTransformer implements DataModelTransformer {
    public async transform<D, T>(event: DataTransformerEvent<D, T>): Promise<void> {
        for (const childMeta of Object.values(event.objectMetadata.fields)) {
            if ('choice' === childMeta.input
                    && typeof childMeta.inputConfig.choices === 'string'
                    && childMeta.inputConfig.choices.startsWith('#/metadatas/')) {
                const field = childMeta.inputConfig.name_path || event.objectMetadata.fieldIdentifier;

                if (childMeta.inputConfig.multiple) {
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
