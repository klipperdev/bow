/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {ContentConfig} from '@klipper/bow/api/ContentConfig';
import {getQueries} from '@klipper/bow/api/imageUtil';
import {Canceler} from '@klipper/http-client/Canceler';
import {KlipperClient} from '@klipper/sdk/KlipperClient';

/**
 * Downloader.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default class Downloader {
    public static getConfig(binding: any): string|ContentConfig|null {
        if (undefined !== binding.oldValue || binding.value === binding.oldValue) {
            return null;
        }

        return binding.value;
    }

    private readonly client: KlipperClient;


    public constructor(client: KlipperClient) {
        this.client = client;
    }

    public downloadContentInElement(el: HTMLElement, config: ContentConfig|string|null): void {
        if (null === config || !(el instanceof HTMLImageElement)) {
            return;
        }

        this.downloadContent(el, config).then((content: string) => {
            el.src = content;
        }).catch(() => {
            el.src = '';
        });
    }

    public async downloadContent(el: HTMLElement, config: ContentConfig|string|null, canceler?: Canceler): Promise<string> {
        config = typeof config === 'string' ? {src: config} : config;

        if (null === config) {
            return '';
        }

        const contentUrl = config.src;
        const queries = getQueries(el, config);
        canceler = canceler || new Canceler();

        try {
            const res = await this.client.requestRaw<any>({
                method: 'GET',
                url: contentUrl,
                responseType: 'arraybuffer',
                params: queries,
            }, canceler);

            if (res) {
                const mimeType = res.headers['content-type'].toLowerCase();
                const imgBase64 = btoa(String.fromCharCode(...new Uint8Array(res.data)));

                return 'data:' + mimeType + ';base64,' + imgBase64;
            }
        } catch (e) {}

        return '';
    }
}
