/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AbstractRequestDataEvent} from '@klipper/bow/http/event/AbstractRequestDataEvent';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class DeleteRequestDataEvent extends AbstractRequestDataEvent {
    public id: string;
}
