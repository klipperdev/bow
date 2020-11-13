/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {PushRequestDataEvent} from '@klipper/bow/http/event/PushRequestDataEvent';
import {ObjectMetadata} from '@klipper/bow/metadata/ObjectMetadata';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class StandardPushRequestDataEvent<D = Dictionary<any>, T = Dictionary<any>> extends PushRequestDataEvent<D> {
    public currentLocale: string;

    public objectMetadata: ObjectMetadata|undefined;

    public dataTransformed: T;
}
