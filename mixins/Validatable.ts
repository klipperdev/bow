/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Component, Prop, Watch} from 'vue-property-decorator';
import {mixins} from 'vue-class-component';
import {InputMessage, InputValidationRules} from 'vuetify/types';
import {Colorable} from '@klipper/bow/mixins/Colorable';
import {Themeable} from '@klipper/bow/mixins/Themeable';
import {inject as RegistrableInject} from '@klipper/bow/mixins/Registrable';
import {consoleError} from '@klipper/bow/utils/console';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class Validatable extends mixins(
    Colorable,
    Themeable,
    RegistrableInject<'form', any>('form'),
) {
    @Prop({type: Boolean})
    public disabled!: boolean;

    @Prop({type: Boolean})
    public error!: boolean;

    @Prop({type: [Number, String], default: 1})
    public errorCount!: number|string;

    @Prop({type: [String, Array], default: () => []})
    public errorMessages!: InputMessage;

    @Prop({type: [String, Array], default: () => []})
    public messages!: InputMessage;

    @Prop({type: Boolean})
    public readonly!: boolean;

    @Prop({type: Array, default: () => []})
    public rules!: InputValidationRules;

    @Prop({type: Boolean})
    public success!: boolean;

    @Prop({type: [String, Array], default: () => []})
    public successMessages!: InputMessage;

    @Prop({type: Boolean})
    public validateOnBlur!: boolean;

    @Prop()
    public value!: unknown;

    public errorBucket: string[] = [];

    public hasColor: boolean = false;

    public hasFocused: boolean = false;

    public hasInput: boolean = false;

    public isFocused: boolean = false;

    public isResetting: boolean = false;

    public lazyValue: unknown = this.value;

    public valid: boolean = false;

    public get computedColor(): string|undefined {
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
    }

    public get hasError(): boolean {
        return this.internalErrorMessages.length > 0
            || this.errorBucket.length > 0
            || this.error;
    }

    public get hasSuccess(): boolean {
        return this.internalSuccessMessages.length > 0 || this.success;
    }

    public get externalError(): boolean {
        return this.internalErrorMessages.length > 0 || this.error;
    }

    public get hasMessages(): boolean {
        return this.validationTarget.length > 0;
    }

    public get hasState(): boolean {
        if (this.isDisabled) {
            return false;
        }

        return this.hasSuccess || (this.shouldValidate && this.hasError);
    }

    public get internalErrorMessages(): InputValidationRules {
        return genInternalMessages(this.errorMessages);
    }

    public get internalMessages(): InputValidationRules {
        return genInternalMessages(this.messages);
    }

    public get internalSuccessMessages(): InputValidationRules {
        return genInternalMessages(this.successMessages);
    }

    public get internalValue(): unknown {
        return this.lazyValue;
    }

    public set internalValue(val: unknown) {
        this.lazyValue = val;
        this.$emit('input', val);
    }

    public get isDisabled(): boolean {
        return this.disabled || (!!this.form && this.form.disabled);
    }

    public get isInteractive(): boolean {
        return !this.isDisabled && !this.isReadonly;
    }

    public get isReadonly(): boolean {
        return this.readonly || (!!this.form && this.form.readonly);
    }

    public get shouldValidate(): boolean {
        if (this.externalError) {
            return true;
        }

        if (this.isResetting) {
            return false;
        }

        return this.validateOnBlur ? this.hasFocused && !this.isFocused : (this.hasInput || this.hasFocused);
    }

    public get validations(): InputValidationRules {
        return this.validationTarget.slice(0, Number(this.errorCount));
    }

    public get validationState(): string|undefined {
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
    }

    public get validationTarget(): InputValidationRules {
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
    }

    @Watch('rules', {deep: true})
    public watchRules(newVal: unknown, oldVal: unknown): void {
        if (newVal === oldVal) {
            return;
        }

        this.validate();
    }

    @Watch('internalValue')
    public watchInternalValue(): void {
        // If it's the first time we're setting input,
        // mark it with hasInput
        this.hasInput = true;

        if (this.validateOnBlur) {
            this.$nextTick(this.validate);
        }
    }

    @Watch('isFocused')
    public watchIsFocused(val: unknown): void {
        // Should not check validation
        // if disabled
        if (!val && !this.isDisabled) {
            this.hasFocused = true;

            if (this.validateOnBlur) {
                this.$nextTick(this.validate);
            }
        }
    }

    @Watch('isResetting')
    public watchIsResetting(): void {
        setTimeout(() => {
            this.hasInput = false;
            this.hasFocused = false;
            this.isResetting = false;
            this.validate();
        }, 0);
    }

    @Watch('hasError')
    public watchHasError(val: unknown): void {
        if (this.shouldValidate) {
            this.$emit('update:error', val);
        }
    }

    @Watch('value')
    public watchValue(val: unknown): void {
        this.lazyValue = val;
    }

    public beforeMount(): void {
        this.validate();
    }

    public created(): void {
        if (this.form) {
            this.form.register(this);
        }
    }

    public beforeDestroy(): void {
        if (this.form) {
            this.form.unregister(this);
        }
    }

    public reset(): void {
        this.isResetting = true;
        this.internalValue = Array.isArray(this.internalValue)
            ? []
            : undefined;
    }

    public resetValidation(): void {
        this.isResetting = true;
    }

    public validate(force = false, value?: any): boolean {
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
    }
}

function genInternalMessages(messages: InputMessage): InputValidationRules {
    if (!messages) {
        return [];
    }

    if (Array.isArray(messages)) {
        return messages;
    }

    return [messages];
}
