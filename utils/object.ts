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
 */
export function isObject(item: any|null|undefined): boolean {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge objects.
 *
 * @param target  The object target
 * @param sources The object sources
 */
export function deepMerge<T = any>(target: Partial<T>, ...sources: Array<Partial<T>|null>): Partial<T> {
    if (!sources.length) {
        return target;
    }

    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                const targetValue = target[key];
                const sourceValue = source[key];

                if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
                    target[key] = (targetValue as any).concat(sourceValue);
                } else if (isObject(targetValue) && isObject(sourceValue)) {
                    deepMerge(targetValue as Partial<any>, sourceValue as Partial<any>);
                } else {
                    target[key] = sourceValue;
                }
            }
        }
    }

    return deepMerge(target, ...sources);
}
