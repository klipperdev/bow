/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AjaxListContent} from '@klipper/bow/mixins/http/AjaxListContent';
import {Organization} from '@klipper/bow/stores/account/Organization';
import {Canceler} from '@klipper/http-client/Canceler';
import {ListResponse} from '@klipper/http-client/models/responses/ListResponse';
import {ListRequestConfig} from '@klipper/sdk/requests/ListRequestConfig';
import {Component, Watch} from 'vue-property-decorator';
import {Location} from 'vue-router';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class BaseAjaxOrganizationList<I extends object = object> extends AjaxListContent<I> {
    public limit: number = 50;

    protected fetchOnMount: boolean = true;

    public created(): void {
        if (this.fetchOnMount) {
            this.loading = !this.isInitialized;
        }
    }

    public async mounted(): Promise<void> {
        if (this.fetchOnMount) {
            await this.fetchData();
        }
    }

    @Watch('search')
    public async watchSearch(searchValue?: string): Promise<void> {
        this.page = 1;
        await this.fetchData(searchValue);
    }

    public async previousPage(): Promise<void> {
        if (this.page > 1) {
            this.page--;
            await this.refresh();
        }
    }

    public async nextPage(): Promise<void> {
        if (this.page < this.pages) {
            this.page++;
            await this.refresh();
        }
    }

    public getRoute(organization: Organization): Location {
        const cr = this.$router.currentRoute;

        if (!!this.$store.state.account.user
                && 'user' === organization.name
                && !this.$klipper.allowUserContext
                && !!this.$klipper.userContextRedirectRoute) {
            return {
                name: this.$klipper.userContextRedirectRoute.name,
                hash: this.$klipper.userContextRedirectRoute.hash,
                query: Object.assign({}, this.$klipper.userContextRedirectRoute.query),
                params: Object.assign({}, this.$klipper.userContextRedirectRoute.params || {}, {
                    org: organization.name,
                }),
                replace: false,
            } as Location;
        }

        return {
            name: cr.name,
            hash: cr.hash,
            query: Object.assign({}, cr.query),
            params: Object.assign({}, cr.params, {
                org: organization.name,
            }),
            replace: false,
        } as Location;
    }

    public async fetchDataRequest(canceler: Canceler, searchValue: string): Promise<ListResponse<I>> {
        this.items = [];

        return await this.$api.requestList({
            url: '/user/organizations',
            page: this.page,
            limit: this.limit,
            search: searchValue,
            sort: 'label:asc',
            fields: [
                'id',
                'name',
                'label',
                'image_url',
            ],
        } as ListRequestConfig, canceler);
    }
}
