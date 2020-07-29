/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {MetadataManager} from './metadata/MetadataManager';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
declare module 'vue/types/vue' {
    interface Vue {
        $metadata: MetadataManager;

        $ml: (name: string) => string;

        $mpl: (name: string) => string;

        $mfl: (object: string, field: string) => string;

        $mal: (object: string, association: string) => string;
    }
}
