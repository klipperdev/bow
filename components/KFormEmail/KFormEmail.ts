/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {RuleValidate} from '@klipper/bow/validator/Rule';
import {mixins} from 'vue-class-component';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KFormEmail extends mixins(
    SlotWrapper,
) {
    protected get genProps(): Dictionary<any> {
        const prependInnerIcon = this.$attrs['prepend-inner-icon'];
        const rules = Array.isArray(this.$attrs.rules) ? this.$attrs.rules as RuleValidate[] : [] as RuleValidate[];

        rules.push(this.$r('email'));

        return Object.assign({
            'prepend-inner-icon': undefined !== prependInnerIcon ? prependInnerIcon : 'fa-fw fa-envelope',
            rules,
        }, this.$attrs);
    }
}
