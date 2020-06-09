/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import _Vue, {PluginObject} from 'vue';
import {Validator} from './Validator';
import {RuleOptions} from './RuleOptions';

/**
 * Validator vue plugin.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default class VueValidator implements PluginObject<Validator> {
    private readonly validator: Validator;

    constructor(validator?: Validator) {
        this.validator = validator || new Validator();
    }

    public install(Vue: typeof _Vue): void {
        Vue.prototype.$validator = this.validator;

        Vue.prototype.$r = (name: string, ruleOptions?: RuleOptions): (value?: any) => boolean|string => {
            return this.validator.r(name, ruleOptions);
        };
    }
}
