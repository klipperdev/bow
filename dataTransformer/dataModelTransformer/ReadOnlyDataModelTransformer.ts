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

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class ReadOnlyDataModelTransformer<D = Dictionary<any>, T = Dictionary<any>> implements DataModelTransformer {
    public async transform<D, T>(event: DataTransformerEvent<D, T>): Promise<void> {
        const existingKeys: string[] = [
            ...Object.keys(event.objectMetadata.fields),
            ...Object.keys(event.objectMetadata.associations),
        ];

        for (const key of Object.keys(event.dataTransformed)) {
            if (!existingKeys.includes(key)) {
                delete (event.dataTransformed as any)[key];
            }
        }

        for (const metaField of Object.values(event.objectMetadata.fields)) {
            if (undefined !== (event.dataTransformed as any)[metaField.name]
                    && metaField.readOnly) {
                delete (event.dataTransformed as any)[metaField.name];
            } else if (undefined === (event.dataTransformed as any)[metaField.name]
                    && !metaField.readOnly
                    && event.inputNames.includes(metaField.name)) {
                (event.dataTransformed as any)[metaField.name] = null;
            }
        }

        for (const metaAsso of Object.values(event.objectMetadata.associations)) {
            if (undefined !== (event.dataTransformed as any)[metaAsso.name]
                    && metaAsso.readOnly) {
                delete (event.dataTransformed as any)[metaAsso.name];
            } else if (undefined === (event.dataTransformed as any)[metaAsso.name]
                    && !metaAsso.readOnly
                    && event.inputNames.includes(metaAsso.name)) {
                (event.dataTransformed as any)[metaAsso.name] = null;
            }
        }
    }
}
