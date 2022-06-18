/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue, {VueConstructor} from 'vue';
import {consoleError} from '@klipper/bow/utils/console';
import {InputValidationRules} from 'vuetify/types';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function formable(componentRef: string): VueConstructor {
    return Vue.extend({
        name: 'Formable',

        computed: {
            hasError(): boolean {
                return this.$refs[componentRef]?.hasError || false;
            },

            hasSuccess(): boolean {
                return this.$refs[componentRef]?.hasSuccess || false;
            },

            externalError(): boolean {
                return this.$refs[componentRef]?.externalError || false;
            },

            hasMessages(): boolean {
                return this.$refs[componentRef]?.hasMessages || false;
            },

            hasState(): boolean {
                return this.$refs[componentRef]?.hasState || false;
            },

            isDisabled(): boolean {
                return this.$refs[componentRef]?.isDisabled || false;
            },

            isInteractive(): boolean {
                return this.$refs[componentRef]?.isInteractive || false;
            },

            isReadonly(): boolean {
                return this.$refs[componentRef]?.isReadonly || false;
            },

            shouldValidate(): boolean {
                return this.$refs[componentRef]?.shouldValidate || false;
            },

            validations(): InputValidationRules {
                return this.$refs[componentRef]?.validations || [];
            },

            validationState(): string|undefined {
                return this.$refs[componentRef]?.validationState;
            },

            validationTarget(): InputValidationRules {
                return this.$refs[componentRef]?.validationTarget || [];
            },
        },

        methods: {
            blur (e?: Event): void {
                this.$refs[componentRef]?.blur(e);
            },

            focus(): void {
                this.$refs[componentRef]?.focus();
            },

            reset(): void {
                this.$refs[componentRef]?.reset();
            },

            clearableCallback(): void {
                this.$refs[componentRef]?.clearableCallback();
            },

            validate(force = false, value?: any): boolean {
                return this.$refs[componentRef]?.validate(force, value) || false;
            },

            resetValidation(): void {
                const ref = this.$refs[componentRef]?.resetValidation();
            },

            setValue(value?: any): void {
                this.$refs[componentRef]?.setValue(value);
            },
        },
    });
}

export function ajaxListFormable(componentRef: string): VueConstructor {
    return Vue.extend({
        name: 'AjaxListFormable',

        computed: {
            page(): number {
                return this.$refs[componentRef]?.page || 1;
            },

            limit(): number {
                return this.$refs[componentRef]?.limit || this.$klipper?.defaultItemPerPage || 20;
            },

            pages(): number {
                return this.$refs[componentRef]?.pages || -1;
            },

            total(): number {
                return this.$refs[componentRef]?.total || 0;
            },

            search(): string {
                return this.$refs[componentRef]?.search || '';
            },
        },

        methods: {
            cancel(): void {
                this.$refs[componentRef]?.cancel();
            },

            reset(): void {
                this.$refs[componentRef]?.reset();
            },

            async previousPage(): Promise<void> {
                await this.$refs[componentRef]?.previousPage();
            },

            async nextPage(): Promise<void> {
                await this.$refs[componentRef]?.nextPage();
            },

            async refreshToFirstPage(): Promise<void> {
                await this.$refs[componentRef]?.refreshToFirstPage();
            },

            deleteItem(value: string|number, key: string): number {
                return this.$refs[componentRef]?.deleteItem(value, key) || 0;
            },

            async refresh(showSnackbar: boolean, topOnRefresh: boolean): Promise<void> {
                await this.$refs[componentRef]?.refresh(showSnackbar, topOnRefresh);
            },
        },
    });
}

export function ajaxSelectFormable(componentRef: string): VueConstructor {
    return Vue.extend({
        name: 'AjaxSelectFormable',

        mixins: [
            formable(componentRef),
            ajaxListFormable(componentRef),
        ],

        methods: {
            async initValue<T = any>(value: T|null): Promise<void> {
                await this.$refs[componentRef]?.initValue(value);
            },

            setValue(value?: any): void {
                this.$refs[componentRef]?.setValue(value);
            },

            setValueByText(value?: any): void {
                this.$refs[componentRef]?.setValueByText(value);
            },
        },
    });
};


export function selectFormable(componentRef: string): VueConstructor {
    return Vue.extend({
        name: 'SelectFormable',

        mixins: [
            formable(componentRef),
        ],
    });
};

const getRef = function(self: Vue, path?: string): any|Vue|Element|(Vue|Element)[]|undefined {
    if (!path) {
        return self;
    }

    const paths = path.split('.');
    const ref = String(paths.shift());

    if (self.$refs[ref]) {
        if (paths.length > 0) {
            return getRef(self.$refs[ref] as any, paths.join('.'));
        }

        return self.$refs[ref];
    }

    return undefined;
};
