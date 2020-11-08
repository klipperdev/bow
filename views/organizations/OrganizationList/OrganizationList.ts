/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {MetaInfo} from 'vue-meta';
import {mixins} from 'vue-class-component';
import {Component, Prop, Watch} from 'vue-property-decorator';
import {BaseAjaxOrganizationList} from '@klipper/bow/mixins/http/components/BaseAjaxOrganizationList';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class UserHome extends mixins(
    BaseAjaxOrganizationList,
) {
    @Prop({type: String})
    public title!: string;

    public metaInfo(): MetaInfo {
        return {
            title: this.title ? this.title : this.$mpl('organization') as string,
        };
    }

    public async mounted(): Promise<void> {
        this.$root.$on('toolbar-search-out', async (searchValue: string | null) => {
            this.search = null !== searchValue ? searchValue.trim() : '';
        });

        this.$root.$on('toolbar-search-request-refresh', async () => {
            this.refresh();
        });

        this.$root.$emit('toolbar-search-refresh');
    }

    public destroyed() {
        this.$root.$off('toolbar-search-out');
    }

    @Watch('search')
    private async searchRequest(searchValue?: string): Promise<void> {
        this.$root.$emit('toolbar-search-in', searchValue);
    }
}
