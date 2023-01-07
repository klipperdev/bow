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
import {Component, Prop, Watch} from 'vue-property-decorator';
import {Location} from 'vue-router';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class BaseAjaxOrganizationList<I extends object = object> extends AjaxListContent<I> {
    @Prop({type: Array, default: () => []})
    public searchFields!: string[];

    public limit: number = 50;

    protected fetchOnMount: boolean = true;

    public created(): void {
        if (this.fetchOnMount) {
            this.loading = !this.isInitialized;
        }
    }

    public async mounted(): Promise<void> {
        if (this.fetchOnMount) {
            this.fetchData().then();
        }
    }

    @Watch('search')
    public watchSearch(searchValue?: string): void {
        this.page = 1;
        this.fetchData(searchValue).then();
    }

    public getRoute(organization: Organization): Location {
        const cr = this.$router.currentRoute;

        if (!!this.$store.state.account.user
            && 'user' === this.$org
            && !this.$klipper.allowUserContext
            && !!this.$klipper.userContextRedirectOrgRoute
        ) {

            return {
                name: this.$klipper.userContextRedirectOrgRoute.name,
                hash: this.$klipper.userContextRedirectOrgRoute.hash,
                query: Object.assign({}, this.$klipper.userContextRedirectOrgRoute.query),
                params: Object.assign({}, this.$klipper.userContextRedirectOrgRoute.params || {}, {
                    org: organization.name,
                }),
                replace: false,
            } as Location;
        }

        if (!!this.$store.state.account.user
                && ('user' === organization.name || 'user' === this.$org)
                && !this.$klipper.allowUserContext
                && !!this.$klipper.userContextRedirectRoute
        ) {
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
            searchFields : this.searchFields.length > 0 ? this.searchFields : undefined,
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
