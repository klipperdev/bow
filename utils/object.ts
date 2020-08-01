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
 * Check if the object values are equals.
 */
export function deepEqual(object1?: object, object2?: object): boolean {
    if (undefined === object1 || undefined === object2) {
        return object1 === object2;
    }

    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (const key of keys1) {
        const val1 = (object1 as any)[key];
        const val2 = (object2 as any)[key];
        const areObjects = isObject(val1) && isObject(val2);

        if (areObjects && !deepEqual(val1, val2)
                || !areObjects && val1 !== val2) {
            return false;
        }
    }

    return true;
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
