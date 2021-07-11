/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {SnackbarMessage} from '@klipper/bow/snackbar/SnackbarMessage';
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KStandardComponentModal extends Vue {
    @Prop({type: String, required: true})
    public metadata!: string;

    @Prop({type: String, default: ''})
    public emitPrefix!: string;

    @Prop({type: Object, default: () => {}})
    public dialogProps!: Dictionary<any>;

    @Prop({type: Boolean, default: false})
    public noSnackbar!: boolean;

    @Prop({type: Boolean, default: false})
    public keepOpenAfterCreated!: boolean;

    @Prop({type: String, default: 'primary'})
    public saveButtonColor!: string;

    @Prop({type: Boolean, default: false})
    public editOnly!: boolean;

    @Prop({type: String, default() {
        return this.$t('component.standard-component-modal.message.success-created');
    }})
    public messageCreatedSuccess!: string;

    @Prop({type: String, default() {
        return this.$t('component.standard-component-modal.message.success-updated');
    }})
    public messageUpdatedSuccess!: string;

    public value: Dictionary<any>|null = null;

    private dialog: boolean = false;

    private isCreate: boolean = false;

    public get emitOpenName(): string {
        return (!!this.emitPrefix ? this.emitPrefix : this.metadata.replaceAll('_', '-'))
            + '-modal-open';
    }

    public created(): void {
        this.$root.$on(this.emitOpenName, (value?: Dictionary<any>) => {
            this.open(value);
        });
    }

    public destroyed(): void {
        this.$root.$off(this.emitOpenName + this._uid);
    }

    public open(value?: Dictionary<any>): void {
        this.value = !!value ? value : null;
        this.isCreate = !!this.value && typeof this.value === 'object' && Object.keys(this.value).length === 0;
        this.dialog = true;
    }

    public close(): void {
        this.dialog = false;
        this.value = null;
        this.isCreate = false;
    }

    private getSlotProps(props?: Dictionary<any>): Dictionary<any> {
        return Object.assign({
            metadata: this.metadata,
            dialogProps: this.dialogProps,
            noSnackbar: this.noSnackbar,
            keepOpenAfterCreated: this.keepOpenAfterCreated,
            messageCreatedSuccess: this.messageCreatedSuccess,
            messageUpdatedSuccess: this.messageUpdatedSuccess,
            value: this.value,
            isOpened: this.dialog,
            isCreate: this.isCreate,
        }, props);
    }

    private onUpserted(): void {
        this.$emit('upserted');

        if (this.isCreate) {
            if (!this.noSnackbar) {
                this.$snackbar.snack(new SnackbarMessage(
                    this.messageCreatedSuccess,
                    'success',
                ));
            }

            this.close();

            if (this.keepOpenAfterCreated) {
                this.$nextTick(() => {
                    this.open({});
                });
            }
        } else {
            if (!this.noSnackbar) {
                this.$snackbar.snack(new SnackbarMessage(
                    this.messageUpdatedSuccess,
                    'success',
                ));
            }

            this.close();
        }
    }

    @Watch('dialog')
    private watchDialog(dialog: boolean): void {
        if (dialog) {
            this.$nextTick(() => {
                (this.$refs.stdView as any).enableEdit();
            });
        } else {
            (this.$refs.stdView as any).cancelEdit();
        }
    }
}
