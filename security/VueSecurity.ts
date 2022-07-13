/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {SecurityManager} from '@klipper/bow/security/SecurityManager';
import {VoterInterface} from '@klipper/bow/security/voters/VoterInterface';
import _Vue, {PluginObject} from 'vue';

/**
 * I18n extra vue plugin.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default class VueSecurity implements PluginObject<SecurityManager> {
    private readonly securityManager: SecurityManager;

    constructor(voters: Array<VoterInterface>) {
        this.securityManager = new SecurityManager(voters);
    }

    public install(Vue: typeof _Vue): void {
        const self = this;

        Object.defineProperty(Vue.prototype, '$security', {
            get(this: Vue): SecurityManager {
                return self.securityManager;
            },
        });

        Vue.prototype.$isGranted = (attribute: string, subject?: any): boolean => {
            return self.securityManager.isGranted(attribute, subject);
        };
    }
}
