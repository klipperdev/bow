/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AjaxListContent} from '@klipper/bow/composables/mixins/http/ajaxListContent';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {Organization} from '@klipper/bow/stores/account/Organization';
import {Canceler} from '@klipper/http-client/Canceler';
import {ListResponse} from '@klipper/http-client/models/responses/ListResponse';
import {ListRequestConfig} from '@klipper/sdk/requests/ListRequestConfig';
import Vue, {PropType} from 'vue';
import {Location} from 'vue-router';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
interface Props {
    searchFields: string[];
    sortFields: string[];
    fields: string[];
}

interface Data {
    limit: number;
    fetchOnMount: boolean;
}

interface Methods<I extends object = object> {
    getRoute(organization: Organization): Location,
    fetchDataRequest(canceler: Canceler, searchValue: string): Promise<ListResponse<I>>,
}

export const BaseAjaxOrganizationList = Vue.extend<Data, Methods<Dictionary<any>>, {}, Props>({
    name: 'baseAjaxOrganizationList',

    mixins: [
        AjaxListContent,
    ],

    props: {
        searchFields: {
            type: Array as PropType<string[]>,
            default: () => [],
        },

        sortFields: {
            type: Array as PropType<string[]>,
            default: () => ['label:asc'],
        },

        fields: {
            type: Array as PropType<string[]>,
            default: () => [],
        },
    },

    data() {
        return {
            limit: 50,
            fetchOnMount: true,
        };
    },

    created(): void {
        if (this.fetchOnMount) {
            this.loading = !this.isInitialized;
        }
    },

    async mounted(): Promise<void> {
        if (this.fetchOnMount) {
            await this.fetchData();
        }
    },

    methods: {
        getRoute(organization: Organization): Location {
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
        },

        async fetchDataRequest<I>(canceler: Canceler, searchValue: string): Promise<ListResponse<I>> {
            this.items = [];

            return await this.$api.requestList({
                url: '/user/organizations',
                page: this.page,
                limit: this.limit,
                search: searchValue,
                searchFields : this.searchFields.length > 0 ? this.searchFields : undefined,
                sort: this.sortFields,
                fields: [
                    'id',
                    'name',
                    'label',
                    'image_url',
                    ...this.fields,
                ],
            } as ListRequestConfig, canceler);
        },
    },

    watch: {
        search: {
            async handler(searchValue?: string): Promise<void> {
                this.page = 1;
                await this.fetchData(searchValue);
            },
        },
    },
});
