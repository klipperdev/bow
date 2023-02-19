/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {consoleWarn} from '@klipper/bow/utils/console';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class SyncState<S = Dictionary<any>> {
    private readonly instanceId!: string;

    private readonly window!: Window;

    constructor(window: Window) {
        this.window = window;
        this.instanceId = Math.random().toString(36).substring(2, 15)
            + Math.random().toString(36).substring(2, 15);
    }

    public storageAvailable(): Boolean {
        const test = 'klipper-bow-sync-state-test';

        try {
            this.window.localStorage.setItem(test, test);
            this.window.localStorage.removeItem(test);

            return true;
        } catch (e) {
            return false;
        }
    }

    public saveState(key: string, state: S) {
        this.window.localStorage.setItem(key, JSON.stringify({
            id: this.instanceId,
            state,
        }));
    }

    public addEventListener<S>(key: string, callback: (state: S, storageNamespace?: string) => void) {
        return this.window.addEventListener('storage', (event: StorageEvent) => {
            const eventKeyPath = (event.key || key).split(':');
            const storageKey = eventKeyPath[0];
            const storageNamespace = eventKeyPath[1];

            if (!event.newValue || storageKey !== key) {
                return;
            }

            try {
                const newState = JSON.parse(event.newValue);

                // Check if the new state is from another instance
                if (newState.id !== this.instanceId) {
                    callback(newState.state, storageNamespace);
                }
            } catch (e) {
                consoleWarn(`New state saved in localStorage with key ${eventKeyPath.join(':')} is invalid`);
            }
        });
    }
}
