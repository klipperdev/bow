/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {DrawerContextItems} from '@klipper/bow/drawer/DrawerContextItems';
import {DrawerItem} from '@klipper/bow/drawer/DrawerItem';
import {DrawerModuleState} from '@klipper/bow/stores/drawer/DrawerModuleState';
import {DrawerState} from '@klipper/bow/stores/drawer/DrawerState';
import {Module, MutationTree} from 'vuex';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class DrawerModule<R extends DrawerModuleState, C extends DrawerContextItems> implements Module<DrawerState, R> {
    private readonly storage: Storage;

    private initContextItems: C|undefined;

    public constructor(contextItems?: C, storage?: Storage) {
        this.storage = storage ? storage : localStorage;
        this.initContextItems = contextItems;
    }

    public get namespaced(): boolean {
        return true;
    }

    public get state(): DrawerState<C> {
        const contextItems = this.initContextItems;

        if (this.initContextItems) {
            this.initContextItems = undefined;
        }

        return {
            mini: null === this.storage.getItem('drawer:mini')
                ? false
                : 'true' === (this.storage.getItem('drawer:mini')),
            show: null === this.storage.getItem('drawer:show')
                ? true
                : 'true' === (this.storage.getItem('drawer:show')),
            context: 'user',
            contextItems: contextItems || {
                user: [] as DrawerItem[],
                organization: [] as DrawerItem[],
            } as C,
        };
    }

    public get mutations(): MutationTree<DrawerState> {
        const self = this;

        return {
            toggleMini(state: DrawerState, mini?: boolean): void {
                state.mini = undefined === mini ? !state.mini : mini;
                self.storage.setItem('drawer:mini', state.mini ? 'true' : 'false');
            },
            toggle(state: DrawerState, show?: boolean): void {
                state.show = undefined === show ? !state.show : show;
                self.storage.setItem('drawer:show', state.show ? 'true' : 'false');
            },
            setContext(state: DrawerState, context: string): void {
                state.context = context;
            },
            setContextItems(state: DrawerState, contextItems: C): void {
                state.contextItems = contextItems;
            },
            syncState(state: DrawerState, newState: DrawerState): void {
                state.mini = newState.mini;
                state.show = newState.show;
            },
        };
    }
}
