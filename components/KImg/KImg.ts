/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {ContentConfig} from '@klipper/bow/api/ContentConfig';
import {Canceler} from '@klipper/http-client/Canceler';
import {CancelerBag} from '@klipper/http-client/CancelerBag';
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KImg extends Vue {
    @Prop({type: String})
    public apiSrc: string;

    @Prop({type: String})
    public mode?: string;

    private lazyData: string = '';

    private isMounted: boolean = false;

    private previousRequests: CancelerBag = new CancelerBag();

    private get classes(): object {
        return {
            'k-img': true,
            'k-img-container': 'cover' !== this.mode,
            'k-img-cover': 'cover' === this.mode,
        };
    }

    private get isLoaded(): boolean {
        return '' !== this.lazyData;
    }

    public async mounted(): Promise<void> {
        this.isMounted = true;
    }

    public async destroyed(): Promise<void> {
        this.previousRequests.cancelAll();
    }

    private async loadLazyData(): Promise<void> {
        this.previousRequests.cancelAll();

        if (this.apiSrc) {
            const canceler = new Canceler();
            this.previousRequests.add(canceler);

            try {
                this.lazyData = await this.$downloader.downloadContent((this.$el as HTMLElement), {
                    src: this.apiSrc,
                    mode: this.mode,
                } as ContentConfig, canceler);
            } catch (e) {
                this.previousRequests.remove(canceler);
            }
        } else {
            this.lazyData = '';
        }
    }

    @Watch('apiSrc')
    private async watchApiSrc(): Promise<void> {
        await this.loadLazyData();
    }

    @Watch('mode')
    private async watchMode(): Promise<void> {
        await this.loadLazyData();
    }

    @Watch('isMounted')
    private async watchIsMounted(): Promise<void> {
        await this.loadLazyData();
    }
}
