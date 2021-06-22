/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Defined, OptionChainType} from '@klipper/bow/types/optionChain';

/**
 * Proxy based implementation of optional chaining with default values.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function oc<T>(data?: T): OptionChainType<T> {
    return new Proxy(
        ((defaultValue?: Defined<T>) => (data == null ? defaultValue : data)) as OptionChainType<T>,
        {
            get: (target, key) => {
                const obj: any = target();

                return oc(typeof obj === 'object' ? obj[key] : undefined);
            },
        },
    );
}
