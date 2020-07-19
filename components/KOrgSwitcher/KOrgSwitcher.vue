<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-navigation-drawer
            color="blue-grey darken-3"
            dark
            temporary
            :touchless="!open"
            fixed
            :mini-variant="false"
            :hide-overlay="true"
            v-model="open"
    >
        <!-- Drawer Header -->
        <template v-slot:prepend>
            <v-list>
                <v-list-item>
                    <v-text-field v-model="search"
                                  clearable
                                  solo-inverted
                                  rounded
                                  flat
                                  hide-details
                                  autofocus
                                  :placeholder="$t('search')"
                                  :value="search"
                                  autocomplete="off"
                    >
                    </v-text-field>
                </v-list-item>

                <v-list-item>
                    <v-list-item-subtitle>
                        {{ $t('organization.switcher.availables') }}
                    </v-list-item-subtitle>
                </v-list-item>
            </v-list>
        </template>

        <!-- Drawer Footer -->
        <template v-slot:append>
            <!-- User context -->
            <v-list v-if="!!userItem"
                    rounded
                    dense
                    class="pt-1 pb-0"
            >
                <v-list-item :to="getRoute(userItem)"
                             selectable
                             class="ml-0 mr-0"
                >
                    <v-list-item-avatar :color="userItem.image_url ? 'white' : ''">
                        <k-img v-if="userItem.image_url"
                               :api-src="userItem.image_url"
                               mode="cover"
                        >
                            <template v-slot:default="{loaded}">
                                <v-container v-if="!loaded">
                                    <v-row class="fill-height ma-0"
                                           align="center"
                                           justify="center"
                                    >
                                        <v-icon color="secondary">fa fa-user</v-icon>
                                    </v-row>
                                </v-container>
                            </template>
                        </k-img>
                        <v-icon v-else>
                            fa fa-user
                        </v-icon>
                    </v-list-item-avatar>

                    <v-list-item-title>
                        {{ userItem.label }}
                    </v-list-item-title>
                </v-list-item>
            </v-list>

            <!-- Org pagination -->
            <v-row class="ml-0 mr-0">
                <v-col cols="2" class="pl-2 pr-2">
                    <v-btn small rounded ripple icon @click="refresh">
                        <v-icon small>refresh</v-icon>
                    </v-btn>
                </v-col>

                <v-col cols="8" class="text-center">
                    <v-fade-transition mode="out-in">
                        <div v-if="hasPagination">
                            <v-btn small rounded ripple icon @click="previousPage" :disabled="page <= 1">
                                <v-icon small>chevron_left</v-icon>
                            </v-btn>

                            <v-fade-transition mode="out-in">
                                <span class="ml-2 text-caption white--text" :key="page">{{ page }}</span>
                            </v-fade-transition>
                            <span class="ml-2 mr-2 text-caption white--text">/</span>
                            <span class="mr-2 text-caption white--text">{{ pages > 0 ? pages : 1 }}</span>

                            <v-btn small rounded ripple icon @click="nextPage" :disabled="page >= pages">
                                <v-icon small>chevron_right</v-icon>
                            </v-btn>
                        </div>
                    </v-fade-transition>
                </v-col>

                <v-col cols="2" class="pl-2 pr-2 text-right">
                    <v-btn small rounded ripple icon @click="open = !open">
                        <v-icon small>fa fa-chevron-left</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </template>

        <!-- Organization list items -->
        <v-list rounded dense>
            <v-slide-y-transition mode="out-in">
                <v-list-item v-if="loading">
                    <k-loading class="mt-5" progress-color=""></k-loading>
                </v-list-item>

                <v-data-iterator v-else
                                 :items="items"
                                 :items-per-page.sync="limit"
                                 :page.sync="page"
                                 :loading="loading"
                                 :search="search"
                                 item-key="name"
                                 hide-default-footer
                >
                    <template v-slot:default="props">
                        <v-list-item v-for="item in props.items"
                                     :key="item.name"
                                     :to="getRoute(item)"
                                     selectable
                                     v-if="open"
                        >
                            <v-list-item-avatar color="white">
                                <k-img v-if="item.image_url"
                                       :api-src="item.image_url"
                                       mode="cover"
                                >
                                    <template v-slot:default="{loaded}">
                                        <v-container v-if="!loaded">
                                            <v-row class="fill-height ma-0"
                                                   align="center"
                                                   justify="center"
                                            >
                                                <v-icon color="secondary">fa fa-building</v-icon>
                                            </v-row>
                                        </v-container>
                                    </template>
                                </k-img>
                                <v-icon v-else color="secondary">
                                    fa fa-building
                                </v-icon>
                            </v-list-item-avatar>

                            <v-list-item-title>
                                {{ item.label }}
                            </v-list-item-title>
                        </v-list-item>
                    </template>

                    <template v-slot:no-data>
                        <v-list-item dense>
                            {{ $t('no-result') }}
                        </v-list-item>
                    </template>
                </v-data-iterator>
            </v-slide-y-transition>
        </v-list>
    </v-navigation-drawer>
</template>

<script lang="ts">
    import {Component, Watch} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {Location} from 'vue-router';
    import {Canceler} from '@klipper/http-client/Canceler';
    import {ListResponse} from '@klipper/http-client/models/responses/ListResponse';
    import {ListRequestConfig} from '@klipper/sdk/requests/ListRequestConfig';
    import {AjaxListContent} from '../../http/mixins/AjaxListContent';
    import {Organization} from '../../stores/account/Organization';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KOrgSwitcher extends mixins(AjaxListContent) {
        public limit: number = 50;

        public get open(): boolean {
            return this.$store.state.account.organizationSwitcherOpen;
        }

        public get accountInitialized(): boolean {
            return this.$store.state.account.initialized;
        }

        public set open(value: boolean) {
            if (!this.$store.state.account.initialized) {
                value = false;
            }

            this.$store.state.account.organizationSwitcherOpen = value;
        }

        public get userItem(): any|null {
            if (!!this.$store.state.account.user
                    && ('user' !== this.$store.state.account.organization || this.$klipper.allowUserContext)) {
                return {
                    id: this.$store.state.account.user.id,
                    name: 'user',
                    label: this.$klipper.allowUserContext
                        ? this.$store.state.account.user.fullName
                        : this.$t('my-account'),
                    image_url: this.$store.state.account.user.imageUrl,
                };
            }

            return null;
        }

        @Watch('accountInitialized')
        public async watchInitialized(initialized: boolean): Promise<void> {
            if (!initialized) {
                this.cancel();
                this.pages = -1;
            }
        }

        @Watch('open')
        public async watchOpen(opened: boolean): Promise<void> {
            if (!opened) {
                this.cancel();
            } else if (!this.isInitialized) {
                await this.refresh();
            }
        }

        @Watch('search')
        public async watchSearch(searchValue?: string): Promise<void> {
            await this.fetchData(searchValue);
        }

        public async mounted(): Promise<void> {
            window.addEventListener('keyup', this.keyDownHandler);
            if (!this.isInitialized) {
                this.loading = true;
            }

            if (this.open) {
                await this.refresh();
            }
        }

        public destroyed(): void {
            window.removeEventListener('keyup', this.keyDownHandler);
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

        public keyDownHandler(event: KeyboardEvent): void {
            if (event.code === 'Escape' && this.open) {
                this.open = false;
            } else if (event.shiftKey && event.altKey && event.code === 'KeyS') {
                this.open = !this.open;
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

        public async fetchDataRequest(canceler: Canceler, searchValue: string): Promise<ListResponse> {
            this.items = [];
            const res = await this.$api.requestList({
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

            return res;
        }
    }
</script>
