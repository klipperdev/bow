/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Selfable} from '@klipper/bow/mixins/Selfable';
import {mixins} from 'vue-class-component';
import {Component, Prop, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KSearchField extends mixins(
    Selfable,
) {
    public search: string = '';

    @Prop({type: String, required: true})
    public prefix!: string;

    public async created(): Promise<void> {
        this.$root.$on(this.prefix + '-in', async (searchValue: string) => {
            this.search = searchValue;
        });

        this.$root.$on(this.prefix + '-refresh', async () => {
            this.$root.$emit(this.prefix + '-out', this.search);
        });

        this.$root.$emit(this.prefix + '-created');
    }

    public destroyed() {
        this.$root.$off(this.prefix + '-in');
        this.$root.$off(this.prefix + '-refresh');
    }

    public refresh(): void {
        this.$root.$emit(this.prefix + '-request-refresh');
    }

    @Watch('search')
    private watchSearch(searchValue?: string): void {
        this.$root.$emit(this.prefix + '-out', searchValue);
    }
}
