/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
declare module 'vue/types/vue' {
    interface Vue {
        $oc: <T = any>(data?: T|any) => OptionChainType<T|any>;
    }
}

/**
 * A generic type that cannot be `undefined`.
 */
type Defined<T> = Exclude<T, undefined>;

/**
 * Data accessor interface to dereference the value of the `OptionChainType`.
 */
interface OptionChainDataAccessor<T> {
    /**
     * Data accessor without a default value. If no data exists,
     * `undefined` is returned.
     */
    (noDefaultValue?: undefined): Defined<T> | undefined;

    /**
     * Data accessor with default value.
     */
    (defaultValue: NonNullable<T>): NonNullable<T>;
    (nullDefaultValue: T extends null ? null : never): Defined<T>; // Null case
}

/**
 * `OptionChainObjectWrapper` gives TypeScript visibility into the properties of
 * an `OptionChainType` object at compile-time.
 */
type OptionChainObjectWrapper<T> = { [K in keyof T]-?: OptionChainType<T[K]> };

/**
 * `OptionChainArrayWrapper` gives TypeScript visibility into the `OptionChainType` values of an array
 * without exposing Array methods (it is problematic to attempt to invoke methods during
 * the course of an optional chain traversal).
 */
interface OptionChainArrayWrapper<T> {
    length: OptionChainType<number>;
    [K: number]: OptionChainType<T>;
}

/**
 * Data accessor interface to dereference the value of an `any` type.
 */
interface OptionChainAny extends OptionChainDataAccessor<any> {
    [K: string]: OptionChainAny; // Enable deep traversal of arbitrary props
}

/**
 * `OptionChainDataWrapper` selects between `OptionChainArrayWrapper`, `OptionChainObjectWrapper`,
 * and `OptionChainDataAccessor` to wrap Arrays, Objects and all other types respectively.
 */
type OptionChainDataWrapper<T> =
    0 extends (1 & T) // Is T any? (https://stackoverflow.com/questions/49927523/disallow-call-with-any/49928360#49928360)
        ? OptionChainAny
        : T extends any[] // Is T array-like?
        ? OptionChainArrayWrapper<T[number]>
        : T extends object // Is T object-like?
            ? OptionChainObjectWrapper<T>
            : OptionChainDataAccessor<T>;

/**
 * An object that supports optional chaining
 */
type OptionChainType<T> = OptionChainDataAccessor<T> & OptionChainDataWrapper<NonNullable<T>>;

/**
 * Optional chaining with default values. To inspect a property value in
 * a tree-like structure, invoke it as a function, optionally passing a default value.
 *
 * @example
 *   // Given:
 *   const x = oc<T>({
 *     a: 'hello',
 *     b: { d: 'world' },
 *     c: [-100, 200, -300],
 *   });
 *
 *   // Then:
 *   x.a() === 'hello'
 *   x.b.d() === 'world'
 *   x.c[0]() === -100
 *   x.c[100]() === undefined
 *   x.c[100](1234) === 1234
 *   x.c.map((e) => e()) === [-100, 200, -300]
 *   x.d.e() === undefined
 *   x.d.e('optional default value') === 'optional default value'
 *   (x as any).y.z.a.b.c.d.e.f.g.h.i.j.k() === undefined
 */
export declare function oc<T>(data?: T): OptionChainType<T>;
