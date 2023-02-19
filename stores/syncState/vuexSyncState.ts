/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {SyncState} from '@klipper/bow/stores/syncState/SyncState';
import {SyncStateOptions} from '@klipper/bow/stores/syncState/SyncStateOptions';
import {deepEqual, deepMerge, getPropertyFromItem, removeDeepValue, setDeepValue} from '@klipper/bow/utils/object';
import {MutationPayload, Store} from 'vuex';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default function createSyncState<S extends Dictionary<any> = Dictionary<any>>(options?: SyncStateOptions) {
    const syncState = new SyncState(window);
    const key: string = options?.key || 'state';
    const statesPaths: string[] = options?.statesPaths || [];
    const namespacedModules: string[] = options?.namespacedModules || [];

    function filterStates(state: S): S {
        const result = {} as S;

        statesPaths.forEach((statePath: string) => {
            setDeepValue(result, statePath, getPropertyFromItem(state, statePath));
        });

        return result;
    }

    function mergeState(oldState: S, newState: S) {
        if (statesPaths.length === 0) {
            return {
                ...newState,
            };
        }

        const merged = {
            ...oldState,
        };

        statesPaths.forEach((statePath: string) => {
            const newValue = getPropertyFromItem(newState, statePath);

            if (typeof newValue === 'undefined') {
                removeDeepValue(merged, statePath);
            } else {
                setDeepValue(merged, statePath, newValue);
            }
        });

        return merged;
    }

    function getNamespace(state: S): string|undefined {
        return  typeof options?.namespaceSuffix === 'function'
            ? options?.namespaceSuffix(state, options || {})
            : options?.namespaceSuffix;
    }

    if (!syncState.storageAvailable()) {
        throw new Error('Local storage is not available!');
    }

    return (store: Store<S>) => {
        syncState.addEventListener(key, (state: S, storageNamespace?: string): void => {
            const currentNamespace = getNamespace(store.state);

            if (![undefined, currentNamespace].includes(storageNamespace)) {
                return;
            }

            Object.keys(state).forEach((module: string) => {
                const action = module + '/syncState';

                if ((store as any)._mutations[action] && (store.state as any)[module] && (state as any)[module]) {
                    const storeState = (store.state as any)[module];
                    const newState = (state as any)[module];

                    if (!deepEqual(storeState, newState)) {
                        store.commit(action, mergeState(storeState, newState));
                    }
                }
            });
        });

        store.subscribe((mutation: MutationPayload, state: S): void => {
            const typePaths = mutation.type.split('/');

            if (typePaths.length >= 2 && typePaths[1] !== 'syncState') {
                let toSave = state;

                if (statesPaths.length > 0) {
                    toSave = filterStates(state);
                }

                if (0 === namespacedModules.length) {
                    syncState.saveState(key, toSave);

                    return;
                }

                const namespacedStates: Record<string, S> = {};

                Object.keys(toSave).forEach((module: string) => {
                    const ns = getNamespace(state);
                    const stateKey = ns && namespacedModules.includes(module) ? ns : '_';
                    setDeepValue(namespacedStates, [stateKey, module].join('.'), getPropertyFromItem(toSave, module));
                });

                Object.keys(namespacedStates).forEach((namespace: string) => {
                    syncState.saveState(key + ('_' === namespace ? '' : ':' + namespace), namespacedStates[namespace]);
                });
            }
        });
    };
}
