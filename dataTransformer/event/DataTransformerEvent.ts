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
export class DataTransformerEvent<D = Dictionary<any>, T = Dictionary<any>> {
    public currentLocale: string;

    public objectMetadata: ObjectMetadata;

    public inputNames: string[];

    public originalData: D;

    public data: D;

    public dataTransformed: T;

    public constructor(
        currentLocale: string,
        objectMetadata: ObjectMetadata,
        originalData: D,
        data: D,
        dataTransformed: T,
        inputNames: string[] = [],
    ) {
        this.currentLocale = currentLocale;
        this.objectMetadata = objectMetadata;
        this.data = data;
        this.originalData = originalData;
        this.dataTransformed = dataTransformed;
        this.inputNames = inputNames;
    }
}
