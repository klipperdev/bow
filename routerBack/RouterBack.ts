/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import VueRouter, {RawLocation, Route} from 'vue-router';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class RouterBack {
    private readonly router: VueRouter;

    private forceHistory: boolean = false;

    private useRedirectQuery: boolean = false;

    private rootRoute: RawLocation = {path: '/'};

    private rootName: string|null = null;

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

    public setUseRedirectQuery(useRedirectQuery: boolean): void {
        this.useRedirectQuery = useRedirectQuery;
    }

    public setRootRoute(route: RawLocation): void {
        this.rootRoute = route;
    }

    public isRoot(): boolean {
        if (!this.rootName) {
            const route = this.getRoute(this.rootRoute);
            this.rootName = route && route.name ? route.name : '';
        }

        return this.rootName === this.router.currentRoute.name;
    }

    public async back(): Promise<void> {
        if (this.useRedirectQuery && typeof this.router?.currentRoute?.query.redirect === 'string') {
            await this.router.replace(decodeURIComponent(this.router.currentRoute.query.redirect));

            return;
        }

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

    private getRoute(route: RawLocation): Route|null {
        const resolved = this.router.resolve(route);

        return resolved.route.matched.length > 0 && '*' !== resolved.route.matched[0].path ? resolved.route : null;
    }
}
