/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {KlipperClient} from '@klipper/sdk/KlipperClient';
import {Canceler} from '@klipper/http-client/Canceler';
import {ContentConfig} from '@klipper/bow/api/ContentConfig';
import {getQueries} from '@klipper/bow/api/imageUtil';

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
        config = typeof config === 'string' ? {src: config} : config;

        if (null === config || !(el instanceof HTMLImageElement)) {
            return;
        }

        const contentUrl = config.src;
        const queries = getQueries(el, config);
        const canceler = new Canceler();

        this.client.requestRaw<any>({
            method: 'GET',
            url: contentUrl,
            responseType: 'arraybuffer',
            params: queries,
        }, canceler).then((res) => {
            if (res) {
                const mimeType = res.headers['content-type'].toLowerCase();
                // @ts-ignore
                const imgBase64 = new Buffer(res.data, 'binary').toString('base64');
                el.src = 'data:' + mimeType + ';base64,' + imgBase64;
            } else {
                el.src = contentUrl;
            }
        }).catch(() => {
            canceler.cancel();
            el.src = contentUrl;
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
                // @ts-ignore
                const imgBase64 = new Buffer(res.data, 'binary').toString('base64');

                return 'data:' + mimeType + ';base64,' + imgBase64;
            }
        } catch (e) {}

        return contentUrl;
    }
}
