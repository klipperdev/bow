/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {inject as RegistrableInject} from '@klipper/bow/mixins/Registrable';
import {StandardViewData} from '@klipper/bow/standardView/StandardViewData';
import {mixins} from 'vue-class-component';
import {Component} from 'vue-property-decorator';
import {StandardViewItem as StandardViewItemInterface} from '@klipper/bow/standardView/StandardViewItem';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class StandardViewItem extends mixins(
    RegistrableInject<'standardView', any>('standardView'),
) implements StandardViewItemInterface {
    protected standardData: StandardViewData = {
        metadata: null,
        currentLocale: '',
        editMode: false,
        loading: false,
        data: null,
        pushAction: async () => {},
        error: null,
    };

    public created(): void {
        if (this.standardView) {
            this.standardView.register(this);
        }
    }

    public beforeDestroy(): void {
        if (this.standardView) {
            this.standardView.unregister(this);
        }
    }

    public setStandardData(data: StandardViewData): void {
        this.standardData = data;
    }
}
