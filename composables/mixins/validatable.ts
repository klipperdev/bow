/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Colorable} from '@klipper/bow/composables/mixins/colorable';
import {Themeable} from '@klipper/bow/composables/mixins/themeable';
import {inject as RegistrableInject} from '@klipper/bow/composables/mixins/registrable';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {consoleError} from '@klipper/bow/utils/console';
import Vue, {ComponentOptions, PropType} from 'vue';
import {InputMessage, InputValidationRules} from 'vuetify/types';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
interface Props {
    disabled: boolean;
    error: boolean;
    errorCount: number|string;
    errorMessages: InputMessage;
    messages: InputMessage;
    readonly: boolean;
    rules: InputValidationRules;
    success: boolean;
    successMessages: InputMessage;
    validateOnBlur: boolean;
    value?: unknown;
}

interface Data {
    errorBucket: string[];
    hasColor: boolean;
    hasFocused: boolean;
    hasInput: boolean;
    isFocused: boolean;
    isResetting: boolean;
    lazyValue: unknown;
    valid: boolean;
}

interface Computed {
    get computedColor(): string|undefined;
    get hasError(): boolean;
    get hasSuccess(): boolean;
    get externalError(): boolean;
    get hasMessages(): boolean;
    get hasState(): boolean;
    get internalErrorMessages(): InputValidationRules;
    get internalMessages(): InputValidationRules;
    get internalSuccessMessages(): InputValidationRules;
    get internalValue(): unknown;
    set internalValue(val: unknown);
    get isDisabled(): boolean;
    get isInteractive(): boolean;
    get isReadonly(): boolean;
    get shouldValidate(): boolean;
    get validations(): InputValidationRules;
    get validationState(): string|undefined;
    get validationTarget(): InputValidationRules;

}

interface Methods {
    reset(): void;
    resetValidation(): void;
    validate(force: boolean, value?: any): boolean;
}

export const Validatable = Vue.extend<Data, Methods, Computed, Props>({
    name: 'validatable',

    mixins: [
        Colorable,
        Themeable,
        RegistrableInject<'form', any>('form'),
    ],

    props: {
        disabled: {
            type: Boolean as PropType<boolean>,
            default: false,
        },

        error: {
            type: Boolean as PropType<boolean>,
            default: false,
        },

        errorCount: {
            type: [Number, String] as PropType<number|string>,
            default: 1,
        },

        errorMessages: {
            type: [String, Array] as PropType<InputMessage>,
            default: () => [],
        },

        messages: {
            type: [String, Array] as PropType<InputMessage>,
            default: () => [],
        },

        readonly: {
            type: Boolean as PropType<boolean>,
            default: false,
        },

        rules: {
            type: Array as PropType<InputValidationRules>,
            default: () => [],
        },

        success: {
            type: Boolean as PropType<boolean>,
            default: false,
        },

        successMessages: {
            type: [String, Array] as PropType<InputMessage>,
            default: () => [],
        },

        validateOnBlur: {
            type: Boolean as PropType<boolean>,
            default: false,
        },

        value: {
            type: [Object, Array, String, Number, Boolean] as PropType<unknown>,
        },
    },

    data() {
        return {
            errorBucket: [],
            hasColor: false,
            hasFocused: false,
            hasInput: false,
            isFocused: false,
            isResetting: false,
            lazyValue: this.value,
            valid: false,
        };
    },

    computed: {
        computedColor(): string|undefined {
            if (this.isDisabled) {
                return undefined;
            }

            if (this.color) {
                return this.color;
            }

            // It's assumed that if the input is on a
            // dark background, the user will want to
            // have a white color. If the entire app
            // is setup to be dark, then they will
            // like want to use their primary color
            if (this.isDark && !this.appIsDark) {
                return 'white';
            }

            return 'primary';
        },

        hasError(): boolean {
            return this.internalErrorMessages.length > 0
                || this.errorBucket.length > 0
                || this.error;
        },

        hasSuccess(): boolean {
            return this.internalSuccessMessages.length > 0 || this.success;
        },

        externalError(): boolean {
            return this.internalErrorMessages.length > 0 || this.error;
        },

        hasMessages(): boolean {
            return this.validationTarget.length > 0;
        },

        hasState(): boolean {
            if (this.isDisabled) {
                return false;
            }

            return this.hasSuccess || (this.shouldValidate && this.hasError);
        },

        internalErrorMessages(): InputValidationRules {
            return genInternalMessages(this.errorMessages);
        },

        internalMessages(): InputValidationRules {
            return genInternalMessages(this.messages);
        },

        internalSuccessMessages(): InputValidationRules {
            return genInternalMessages(this.successMessages);
        },

        internalValue: {
            get(): unknown {
                return this.lazyValue;
            },

            set(val: unknown) {
                this.lazyValue = val;
                this.$emit('input', val);
            },
        },

        isDisabled(): boolean {
            return this.disabled || (!!this.form && this.form.disabled);
        },

        isInteractive(): boolean {
            return !this.isDisabled && !this.isReadonly;
        },

        isReadonly(): boolean {
            return this.readonly || (!!this.form && this.form.readonly);
        },

        shouldValidate(): boolean {
            if (this.externalError) {
                return true;
            }

            if (this.isResetting) {
                return false;
            }

            return this.validateOnBlur ? this.hasFocused && !this.isFocused : (this.hasInput || this.hasFocused);
        },

        validations(): InputValidationRules {
            return this.validationTarget.slice(0, Number(this.errorCount));
        },

        validationState(): string|undefined {
            if (this.isDisabled) {
                return undefined;
            }

            if (this.hasError && this.shouldValidate) {
                return 'error';
            }

            if (this.hasSuccess) {
                return 'success';
            }

            if (this.hasColor) {
                return this.computedColor;
            }

            return undefined;
        },

        validationTarget(): InputValidationRules {
            if (this.internalErrorMessages.length > 0) {
                return this.internalErrorMessages;
            } else if ((this.successMessages as any).length > 0) {
                return this.internalSuccessMessages;
            } else if ((this.messages as any).length > 0) {
                return this.internalMessages;
            } else if (this.shouldValidate) {
                return this.errorBucket;
            } else {
                return [];
            }
        },
    },

    watch: {
        rules: {
            deep: true,
            handler(newVal: unknown, oldVal: unknown): void {
                if (newVal === oldVal) {
                    return;
                }

                this.validate();
            },
        },

        internalValue: {
            handler(): void {
                // If it's the first time we're setting input,
                // mark it with hasInput
                this.hasInput = true;

                if (this.validateOnBlur) {
                    this.$nextTick(this.validate);
                }
            },
        },

        isFocused: {
            handler(val: unknown): void {
                // Should not check validation
                // if disabled
                if (!val && !this.isDisabled) {
                    this.hasFocused = true;

                    if (this.validateOnBlur) {
                        this.$nextTick(this.validate);
                    }
                }
            },
        },

        isResetting: {
            handler(): void {
                setTimeout(() => {
                    this.hasInput = false;
                    this.hasFocused = false;
                    this.isResetting = false;
                    this.validate();
                }, 0);
            },
        },

        hasError: {
            handler(val: unknown): void {
                if (this.shouldValidate) {
                    this.$emit('update:error', val);
                }
            },
        },

        value: {
            handler(val: unknown): void {
                this.lazyValue = val;
            },
        },
    },

    beforeMount(): void {
        this.validate();
    },

    methods: {
        reset(): void {
            this.isResetting = true;
            this.internalValue = Array.isArray(this.internalValue)
                ? []
                : undefined;
        },

        resetValidation(): void {
            this.isResetting = true;
        },

        validate(force: boolean = false, value?: any): boolean {
            const errorBucket = [];
            value = value || this.internalValue;

            if (force) {
                this.hasInput = this.hasFocused = true;
            }

            for (let index = 0; index < (this.rules as any).length; index++) {
                const rule = (this.rules as any)[index];
                const valid = typeof rule === 'function' ? rule(value) : rule;

                if (valid === false || typeof valid === 'string') {
                    errorBucket.push(valid || '');
                } else if (typeof valid !== 'boolean') {
                    consoleError(`Rules should return a string or boolean, received '${typeof valid}' instead`, this);
                }
            }

            this.errorBucket = errorBucket;
            this.valid = errorBucket.length === 0;

            return this.valid;
        },
    },
});

function genInternalMessages(messages: InputMessage): InputValidationRules {
    if (!messages) {
        return [];
    }

    if (Array.isArray(messages)) {
        return messages;
    }

    return [messages];
}
