/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {DataTransformerEvent} from '@klipper/bow/dataTransformer/event/DataTransformerEvent';
import {Dictionary} from '@klipper/bow/generic/Dictionary';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export type DataTransformerFunction<D = Dictionary<any>, T = Dictionary<any>> = (event: DataTransformerEvent<D, T>) => Promise<void>;
