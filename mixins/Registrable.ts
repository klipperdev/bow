/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {consoleWarn} from '@klipper/bow/utils/console';
import Vue, {VueConstructor} from 'vue';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export type Registrable<T extends string, C extends VueConstructor|null = null> = VueConstructor<Vue & {
    [K in T]: C extends VueConstructor ? InstanceType<C> : {
        register(...props: any[]): void;
        unregister(self: any): void;
    }
}>;

export function inject<T extends string, C extends VueConstructor|null = null>(namespace: T, child?: string, parent?: string): Registrable<T, C> {
    const defaultImpl = child && parent ? {
        register: generateWarning(child, parent),
        unregister: generateWarning(child, parent),
    } : null;

    return Vue.extend({
        name: 'registrable-inject',

        inject: {
            [namespace]: {
                default: defaultImpl,
            },
        },
    });
}

export function provide(namespace: string, self = false) {
    return Vue.extend({
        name: 'registrable-provide',

        provide(): object {
            return {
                [namespace]: self ? this : {
                    register: (this as any).register,
                    unregister: (this as any).unregister,
                },
            };
        },
    });
}

function generateWarning(child: string, parent: string): Function {
    return () => consoleWarn(`The ${child} component must be used inside a ${parent}`);
}
