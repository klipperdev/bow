/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {deepMerge} from '@klipper/bow/utils/object';
import {mergeMapClasses} from '@klipper/bow/utils/style';
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import Quill, {QuillOptionsStatic} from 'quill';
import 'quill/modules/toolbar';
import 'quill/themes/snow';
import 'quill/formats/bold';
import 'quill/formats/italic';
import 'quill/formats/header';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KFormRichTextarea extends Vue {
    @Prop({type: Boolean, default: false})
    public disabled!: boolean;

    @Prop({type: Boolean, default: false})
    public readOnly!: boolean;

    @Prop({type: String})
    public placeholder!: string;

    @Prop({type: String, default: 'snow'})
    public theme!: string;

    @Prop({type: Number, default: 2000})
    public historyDelay!: number;

    @Prop({type: Number, default: 2000})
    public historyStack!: number;

    @Prop({type: [String, Boolean], default: 'sm', validator: (value?: string|boolean) => {
            if (typeof value === 'boolean') {
                return value === false;
            }

            return -1 !== ['xs', 'sm', 'md', 'lg'].indexOf(value as string);
        }})
    public size!: string|boolean;

    @Prop({type: Object, default: () => {
        return {};
    }})
    public options!: Dictionary<any>;

    @Prop()
    public value!: any;

    private quill: Quill|null = null;

    private get genClasses(): Dictionary<boolean> {
        return mergeMapClasses(
            {
                'form-rich-textarea': true,
                'ql-xs': 'xs' === this.size,
                'ql-sm': 'sm' === this.size,
                'ql-md': 'md' === this.size,
                'ql-lg': 'lg' === this.size,
            },
            !!this.$vnode.data ? this.$vnode.data.class : undefined,
            this.$attrs.class,
        );
    }

    public mounted(): void {
        this.initialize();
    }

    public beforeDestroy(): void {
        this.quill = null;
    }

    private initialize(): void {
        if (this.$refs.editor) {
            this.quill = new Quill(this.$refs.editor as HTMLElement, this.buildOptions());

            this.quill.on('text-change', () => {
                if (!this.quill || !this.$refs.editor || !(this.$refs.editor instanceof HTMLElement)) {
                    return;
                }

                const text = this.quill.getText();
                const html = this.$refs.editor.classList.contains('ql-blank')
                    ? null
                    : this.$refs.editor.children[0].innerHTML;

                this.$emit('input', html);
                this.$emit('change', {
                    html,
                    text,
                    quill: this.quill,
                });
            });

            this.quill.enable(false);

            if (this.value) {
                this.quill.pasteHTML(this.value);
            }

            if (!this.disabled) {
                this.quill.enable(true);
            }

            this.$emit('ready', this.quill);
        }
    }

    private buildOptions(): QuillOptionsStatic {
        return deepMerge({
            theme: this.theme,
            modules: {
                toolbar: [
                    [{header: [1, 2, 3, 4, 5, 6, false]}],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{list: 'ordered'}, {list: 'bullet'}, {list: 'check'}],
                    [{script: 'sub'}, {script: 'super'}],
                    [{indent: '-1'}, {indent: '+1'}],
                    ['link', 'code-block'],
                    [{align: []}],
                    ['clean'],
                ],
                history: {
                    delay: this.historyDelay,
                    maxStack: this.historyStack,
                    userOnly: true,
                },
            },
            placeholder: this.placeholder,
            readOnly: this.readOnly,
        }, this.options);
    }

    @Watch('value', {immediate: true})
    private watchValue(newValue: any, oldValue: any) {
        if (this.quill) {
            if (newValue && newValue !== this.value) {
                this.quill.pasteHTML(newValue);
            } else if (!newValue) {
                this.quill.setText('');
            }
        }
    }

    @Watch('disabled')
    private watchDisabled(newValue: any, oldValue: any) {
        if (this.quill) {
            this.quill.enable(!newValue);
        }
    }
}
