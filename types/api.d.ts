/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {KlipperClient} from '@klipper/sdk/KlipperClient';
import Downloader from '@klipper/bow/api/Downloader';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
declare module 'vue/types/vue' {
    interface Vue {
        $api: KlipperClient;
        $downloader: Downloader;
    }
}
