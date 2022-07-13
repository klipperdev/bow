/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {SecurityManager} from '@klipper/bow/security/SecurityManager';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
declare module 'vue/types/vue' {
    interface Vue {
        $security: SecurityManager;

        $isGranted: (attribute: string, subject?: any) => boolean;
    }
}
