/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AjaxFormContent} from '@klipper/bow/mixins/http/AjaxFormContent';
import {StandardBaseComponent} from '@klipper/bow/mixins/StandardBaseComponent';
import {StandardViewData} from '@klipper/bow/standardView/StandardViewData';
import {mixins} from 'vue-class-component';
import {Component, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class StandardComponentForm extends mixins(
    StandardBaseComponent,
    AjaxFormContent,
) {
    protected get pushLoading(): boolean {
        return this.loading && this.editMode;
    }

    protected get isFormDisabled(): boolean {
        return this.formDisabled || this.loading;
    }

    protected get genStandardData(): StandardViewData {
        return {
            metadata: this.metadataName || null,
            currentLocale: this.currentLocale,
            editMode: this.editMode,
            vertical: this.isVertical,
            dense: this.isDense,
            loading: this.loading,
            showLoading: false,
            isCreate: this.isCreate,
            id: this.id || null,
            data: this.data,
            error: this.previousError,
            pushAction: this.push,
        };
    }

    public async push(): Promise<void> {
        // Override this method
    }

    protected beforeCancelEdit(): void {
        this.resetPreviousError();
    }

    @Watch('loading')
    @Watch('previousError')
    protected watchAjaxStandardDataValues(): void {
        this.watchStandardDataValues();
    }
}
