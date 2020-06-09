/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Check if the item is an object.
 *
 * @return {boolean}
 */
export function isObject(item: any|null): boolean {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge objects.
 *
 * @param {Partial<T>}   target  The object target
 * @param {Partial<T>[]} sources The object sources
 *
 * @return {Partial<T>}
 */
export function deepMerge<T = any>(target: Partial<T>, ...sources: Array<Partial<T>|null>): Partial<T> {
    if (!sources.length) {
        return target;
    }

    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (!source.hasOwnProperty(key)) {
                continue;
            }

            if (isObject(source[key])) {
                if (!target[key]) {
                    Object.assign(target, {
                        [key]: {},
                    });
                }

                deepMerge(target[key] as Partial<T>, source[key] as Partial<T>);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return deepMerge(target, ...sources);
}
