/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {StandardMasterComponent} from '@klipper/bow/mixins/StandardMasterComponent';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KSimpleStandardView extends mixins(
    StandardMasterComponent,
) {
    @Prop({type: Object, default: () => {}})
    public formProps!: Dictionary<any>;

    private get showError(): boolean {
        return !!this.previousError;
    }
}
