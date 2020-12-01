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
import {deepEqual, getPropertyFromItem, removeDeepValue, setDeepValue} from '@klipper/bow/utils/object';
import {MutationPayload, Store} from 'vuex';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default function createSyncState<S = Dictionary<any>>(options?: SyncStateOptions) {
    const syncState = new SyncState(window);
    let key: string = 'state';
    let statesPaths: string[] = [];

    if (options) {
        key = options.key || key;
        statesPaths = options.statesPaths || statesPaths;
    }

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

    function pushSyncState(store: Store<S>, state: S) {
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
    }

    if (!syncState.storageAvailable()) {
        throw new Error('Local storage is not available!');
    }

    return (store: Store<S>) => {
        syncState.addEventListener(key, (state: S) => {
            pushSyncState(store, state);
        });

        store.subscribe((mutation: MutationPayload, state: S) => {
            if (!mutation.type.endsWith('/syncState')) {
                let toSave = state;

                if (statesPaths.length > 0) {
                    toSave = filterStates(state);
                }

                syncState.saveState(key, toSave);
            }
        });
    };
}
