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

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class DataTransformer {
    protected readonly dataModelTransformers: DataModelTransformer[] = [];

    public constructor(dataModelTransformers?: DataModelTransformer[]) {
        for (const dataModelTransformer of (dataModelTransformers || [])) {
            this.dataModelTransformers.push(dataModelTransformer);
        }
    }

    public async transform(event: DataTransformerEvent): Promise<void> {
        for (const dataModelTransformer of this.dataModelTransformers) {
            await dataModelTransformer.transform(event);
        }
    }
}
