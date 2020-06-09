/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import VueRouter, {Route} from 'vue-router';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class RouterBack {
    private readonly router: VueRouter;

    private forceHistory: boolean = false;

    private rootPath: string | null = null;

    public constructor(router: VueRouter) {
        this.router = router;
    }

    public get useBackAction(): boolean {
        return this.forceHistory
            || ('matchMedia' in window && window.matchMedia('(display-mode: standalone)').matches);
    }

    public setForceHistory(forceHistory: boolean): void {
        this.forceHistory = forceHistory;
    }

    public isRoot(): boolean {
        if (!this.rootPath) {
            const route = this.getRoute('/');
            this.rootPath = route ? route.fullPath : '/';
        }

        return this.rootPath === this.router.currentRoute.fullPath;
    }

    public async back(): Promise<void> {
        if (this.useBackAction) {
            this.router.back();

            return;
        }

        let parentPath = this.router.currentRoute.fullPath.replace(/\/$/, '');

        while (true) {
            const match = parentPath.match(/.*\//);

            if (match) {
                parentPath = '/' === match[0] ? '/' : match[0].replace(/\/$/, '');
                const findParentRoute = this.getRoute(parentPath);

                if (findParentRoute) {
                    parentPath = findParentRoute.fullPath;
                    break;
                }
            } else {
                break;
            }
        }

        await this.router.replace(parentPath);
    }

    private getRoute(path: string): Route | null {
        const resolved = this.router.resolve(path);

        return resolved.route.matched.length > 0 && '*' !== resolved.route.matched[0].path ? resolved.route : null;
    }
}
