/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {FetchRequestDataEvent} from '@klipper/bow/http/event/FetchRequestDataEvent';
import {ObjectMetadata} from '@klipper/bow/metadata/ObjectMetadata';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class StandardFetchRequestDataEvent extends FetchRequestDataEvent {
    public currentLocale: string;

    public objectMetadata: ObjectMetadata|undefined;
}
