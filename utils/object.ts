/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {isNumber} from '@klipper/bow/utils/number';
import Vue from 'vue';
import {SelectItemKey} from 'vuetify/types';

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
                } else if (undefined === targetValue && Array.isArray(sourceValue)) {
                    target[key] = ([] as any).concat(sourceValue);
                } else if (undefined === targetValue && isObject(sourceValue)) {
                    target[key] = {} as any;
                    deepMerge(target[key] as Partial<any>, sourceValue as Partial<any>);
                } else {
                    target[key] = sourceValue;
                }
            }
        }
    }

    return deepMerge(target, ...sources);
}

export function extractIdentifiers<T extends string|number = string|number>(field: string, values?: Array<Dictionary<any>|null|T>, fallback: T[] = []): T[] {
    const ids = [] as T[];

    (values || []).forEach((value) => {
        if (typeof value === 'object') {
            const id = extractIdentifier<T>(field, value);

            if (undefined !== id) {
                ids.push(id);
            }
        } else {
            ids.push(value);
        }
    });

    return ids.length > 0 ? ids : fallback;
}

export function extractIdentifier<T extends string|number = string|number>(field: string, value?: Dictionary<any>|null|T, fallback?: any): T|undefined {
    if (typeof value === 'object') {
        return getObjectValueByPath(value, field, fallback);
    }

    if (typeof value === 'string' || typeof value === 'number') {
        return value;
    }

    return fallback;
}

export function getNestedValue(obj: any, path: Array<string|number>, fallback?: any): any|undefined {
    const last = path.length - 1;

    if (last < 0) {
        return obj === undefined ? fallback : obj;
    }

    for (let i = 0; i < last; i++) {
        if (obj == null) {
            return fallback;
        }

        obj = obj[path[i]];
    }

    if (obj == null) {
        return fallback;
    }

    return obj[path[last]] === undefined ? fallback : obj[path[last]];
}

export function getObjectValueByPath(obj: any, path: string, fallback?: any): any|undefined {
    // credit: http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key#comment55278413_6491621
    if (obj == null || !path) {
        return fallback;
    }

    if (obj[path] !== undefined) {
        return obj[path];
    }

    path = path.replace(/\[(\w+)]/g, '.$1'); // convert indexes to properties
    path = path.replace(/^\./, ''); // strip a leading dot

    return getNestedValue(obj, path.split('.'), fallback);
}

export function getPropertyFromItem<R = any|undefined>(item: Dictionary<any>|any, property: SelectItemKey|string, fallback?: R): R {
    if (null === property) {
        return item === undefined ? fallback : item;
    }

    if (item !== Object(item)) {
        return fallback === undefined ? item : fallback;
    }

    if (typeof property === 'string') {
        return getObjectValueByPath(item, property, fallback);
    }

    if (Array.isArray(property)) {
        return getNestedValue(item, property, fallback);
    }

    if (typeof property !== 'function') {
        return fallback as R;
    }

    const value = property(item, fallback);

    return typeof value === 'undefined' ? fallback : value;
}

export function setDeepValue<V = any, O = Dictionary<any>>(object: O, path: string|string[], value: V): O {
    if (!path || Object(object) !== object) {
        return object;
    }

    if (!Array.isArray(path)) {
        path = path.toString().match(/[^.[\]]+/g) || [];
    }

    const res = path.slice(0, -1).reduce<Dictionary<any>>(
        (a, c, i) => {
            if (Object(a[c]) === a[c]) {
                return a[c];
            }

            a[c] = isNumber(path[i + 1]) ? [] : {};

            return a[c];
        },
        object,
    );

    res[path[path.length - 1]] = value;

    return object;
}

export function removeDeepValue<V = any, O = Dictionary<any>>(object: O, path: string|string[]): O {
    if (!path || Object(object) !== object) {
        return object;
    }

    if (!Array.isArray(path)) {
        path = path.toString().match(/[^.[\]]+/g) || [];
    }

    const res = path.slice(0, -1).reduce<Dictionary<any>>(
        (a, c, i) => {
            if (Object(a[c]) === a[c]) {
                return a[c];
            }

            a[c] = isNumber(path[i + 1]) ? [] : {};

            return a[c];
        },
        object,
    );

    delete res[path[path.length - 1]];

    return object;
}

export function setReactiveDeepValue<V = any, O = Dictionary<any>>(object: O, path: string|string[], value: V): O {
    if (!path || Object(object) !== object) {
        return object;
    }

    if (!Array.isArray(path)) {
        path = path.toString().match(/[^.[\]]+/g) || [];
    }

    const res = path.slice(0, -1).reduce<Dictionary<any>>(
        (a, c, i) => {
            if (Object(a[c]) === a[c]) {
                return a[c];
            }

            Vue.set(a, c, isNumber(path[i + 1]) ? [] : {});

            return a[c];
        },
        object,
    );

    Vue.set(res, path[path.length - 1], value);

    return object;
}

export function callMethod<V = any>(objet: {[index: string]: any}, method: string, ...args: V[]): void {
    if (typeof objet === 'object' && typeof objet[method] === 'function') {
        objet[method](...args);
    }
}
