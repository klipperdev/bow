/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {RuleConstructor, RuleValidate} from '@klipper/bow/validator/Rule';
import {RuleOptions} from '@klipper/bow/validator/RuleOptions';
import {MessageUtil} from '@klipper/bow/validator/utils/MessageUtil';
import {Validator} from '@klipper/bow/validator/Validator';
import VueI18n from 'vue-i18n';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class I18nValidator extends Validator {
    private i18n?: VueI18n;

    /**
     * Constructor.
     */
    constructor(rules?: RuleConstructor[], i18n?: VueI18n) {
        super(rules);

        this.i18n = i18n;
    }

    /**
     * Set the i18n.
     */
    public setI18n(i18n?: VueI18n): void {
        this.i18n = i18n;
    }

    public r(name: string, options?: RuleOptions): RuleValidate {
        const rule = this.getRule(name, options);
        const i18n = this.i18n;

        return (value?: any): boolean|string => {
            let res = rule.validate(value);

            if (typeof res === 'string') {
                const values = Object.assign({}, rule.getOptions(), {value});

                res = i18n ? i18n.t(res, values) as string : MessageUtil.replace(res, values);
            }

            return res;
        };
    }
}
