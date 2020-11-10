/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Validator} from '@klipper/bow/validator/Validator';
import {RuleValidate} from '@klipper/bow/validator/Rule';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
declare module 'vue/types/vue' {
    interface Vue {
        $validator: Validator;
        $r: (name: string) => RuleValidate;
    }
}
