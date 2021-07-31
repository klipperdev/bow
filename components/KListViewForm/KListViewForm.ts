/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {AjaxContent} from '@klipper/bow/mixins/http/AjaxContent';
import {AjaxFormContent} from '@klipper/bow/mixins/http/AjaxFormContent';
import {Selfable} from '@klipper/bow/mixins/Selfable';
import {Canceler} from '@klipper/http-client/Canceler';
import {ListViewResponse} from '@klipper/sdk/models/responses/ListViewResponse';
import {mixins} from 'vue-class-component';
import {Component, Prop, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KListViewForm extends mixins(
    AjaxContent,
    AjaxFormContent,
    Selfable,
) {
    @Prop({type: String})
    public type!: string|undefined;

    private id: string|number|null = null;

    private label: string|null = null;

    private name: string|null = null;

    private filters: string|null = null;

    private dialog: boolean = false;

    private advancedMode: boolean = true;

    public open(value?: ListViewResponse): void {
        this.id = value && value.id || null;
        this.label = value && value.label || null;
        this.name = value && value.name || null;
        this.filters = value && value.filters ? JSON.stringify(value.filters) : null;

        this.dialog = true;
    }

    public close(): void {
        this.dialog = false;
    }

    public toggle(): void {
        this.dialog = !this.dialog;
    }

    private async save(copy: boolean = false): Promise<void> {
        if (this.advancedMode && this.isValidForm()) {
            const editMode = !!this.id && !copy;
            const res = await this.fetchData<Dictionary<any>>(async (canceler: Canceler): Promise<Dictionary<any>|null> => {
                return await this.$api.request({
                    url: this.$org + '/list_views' + (editMode ? '/' + this.id : ''),
                    method: editMode ? 'PATCH' : 'POST',
                    data: {
                        label: this.label,
                        name: this.name,
                        type: this.type,
                        filters: this.filters ? JSON.parse(this.filters) : undefined,
                    },
                }, canceler);
            }, false);

            if (res) {
                this.$emit('change', res);
                this.close();
            }
        }
    }

    private async deleteView(id: string|number, canceler: Canceler): Promise<any> {
        await this.$api.request({
            url: this.$org + '/list_views/' + id,
            method: 'DELETE',
        }, canceler);

        return id;
    }

    private async onDeletedView(id: string|number): Promise<void> {
        this.$emit('delete', id);
        this.close();
    }

    @Watch('dialog')
    private watchDialog(open: boolean): void {
        this.resetPreviousError();
        this.resetFormValidation();

        this.$emit(open ? 'open' : 'close');
        this.$emit('toggle', open);
    }
}
