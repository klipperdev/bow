/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {DeleteRequestDataEvent} from '@klipper/bow/http/event/DeleteRequestDataEvent';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export type DeleteRequestDataFunction = (event: DeleteRequestDataEvent) => Promise<void>;
