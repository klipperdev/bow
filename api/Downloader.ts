/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {KlipperClient} from '@klipper/sdk/KlipperClient';
import {ContentConfig} from './ContentConfig';
import {getQueries} from './imageUtil';

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

    public downloadContent(el: HTMLElement, config: ContentConfig|string|null): void {
        config = typeof config === 'string' ? {src: config} : config;

        if (null === config || !(el instanceof HTMLImageElement)) {
            return;
        }

        const contentUrl = config.src;
        const queries = getQueries(el, config);

        this.client.requestRaw<any>({
            method: 'GET',
            url: contentUrl,
            responseType: 'arraybuffer',
            params: queries,
        }).then((res) => {
            if (res) {
                const mimeType = res.headers['content-type'].toLowerCase();
                // @ts-ignore
                const imgBase64 = new Buffer(res.data, 'binary').toString('base64');
                el.src = 'data:' + mimeType + ';base64,' + imgBase64;
            } else {
                el.src = contentUrl;
            }
        }).catch(() => {
            el.src = contentUrl;
        });
    }
}
