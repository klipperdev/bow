/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {genSubRefName} from '@klipper/bow/utils/vnode';
import Vue, {VueConstructor} from 'vue';
import {InputValidationRules} from 'vuetify/types';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function formable(componentRef: string): VueConstructor {
    return Vue.extend({
        name: 'Formable',

        computed: {
            hasError(): boolean {
                return getRefComponent(this, componentRef)?.hasError || false;
            },

            hasSuccess(): boolean {
                return getRefComponent(this, componentRef)?.hasSuccess || false;
            },

            externalError(): boolean {
                return getRefComponent(this, componentRef)?.externalError || false;
            },

            hasMessages(): boolean {
                return getRefComponent(this, componentRef)?.hasMessages || false;
            },

            hasState(): boolean {
                return getRefComponent(this, componentRef)?.hasState || false;
            },

            isDisabled(): boolean {
                return getRefComponent(this, componentRef)?.isDisabled || false;
            },

            isInteractive(): boolean {
                return getRefComponent(this, componentRef)?.isInteractive || false;
            },

            isReadonly(): boolean {
                return getRefComponent(this, componentRef)?.isReadonly || false;
            },

            shouldValidate(): boolean {
                return getRefComponent(this, componentRef)?.shouldValidate || false;
            },

            validations(): InputValidationRules {
                return getRefComponent(this, componentRef)?.validations || [];
            },

            validationState(): string|undefined {
                return getRefComponent(this, componentRef)?.validationState;
            },

            validationTarget(): InputValidationRules {
                return getRefComponent(this, componentRef)?.validationTarget || [];
            },
        },

        methods: {
            blur (e?: Event): void {
                getRefComponent(this, componentRef)?.blur(e);
            },

            focus(): void {
                getRefComponent(this, componentRef)?.focus();
            },

            reset(): void {
                getRefComponent(this, componentRef)?.reset();
            },

            clearableCallback(): void {
                getRefComponent(this, componentRef)?.clearableCallback();
            },

            validate(force = false, value?: any): boolean {
                return getRefComponent(this, componentRef)?.validate(force, value) || false;
            },

            resetValidation(): void {
                const ref = getRefComponent(this, componentRef)?.resetValidation();
            },

            setValue(value?: any): void {
                getRefComponent(this, componentRef)?.setValue(value);
            },
        },
    });
}

export function ajaxListFormable(componentRef: string): VueConstructor {
    return Vue.extend({
        name: 'AjaxListFormable',

        computed: {
            page(): number {
                return getRefComponent(this, componentRef)?.page || 1;
            },

            limit(): number {
                return getRefComponent(this, componentRef)?.limit || this.$klipper?.defaultItemPerPage || 20;
            },

            pages(): number {
                return getRefComponent(this, componentRef)?.pages || -1;
            },

            total(): number {
                return getRefComponent(this, componentRef)?.total || 0;
            },

            search(): string {
                return getRefComponent(this, componentRef)?.search || '';
            },
        },

        methods: {
            cancel(): void {
                getRefComponent(this, componentRef)?.cancel();
            },

            reset(): void {
                getRefComponent(this, componentRef)?.reset();
            },

            async previousPage(): Promise<void> {
                await getRefComponent(this, componentRef)?.previousPage();
            },

            async nextPage(): Promise<void> {
                await getRefComponent(this, componentRef)?.nextPage();
            },

            async refreshToFirstPage(): Promise<void> {
                await getRefComponent(this, componentRef)?.refreshToFirstPage();
            },

            deleteItem(value: string|number, key: string): number {
                return getRefComponent(this, componentRef)?.deleteItem(value, key) || 0;
            },

            async refresh(showSnackbar: boolean, topOnRefresh: boolean): Promise<void> {
                await getRefComponent(this, componentRef)?.refresh(showSnackbar, topOnRefresh);
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
                await getRefComponent(this, componentRef)?.initValue(value);
            },

            setValue(value?: any): void {
                getRefComponent(this, componentRef)?.setValue(value);
            },

            setValueByText(value?: any): void {
                getRefComponent(this, componentRef)?.setValueByText(value);
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

const getRefComponent = function(self: Vue|any, componentRef: string): any|Vue|Element|(Vue|Element)[]|undefined {
    if (self.$scopedSlots[componentRef]) {
        return self.$scopedSlots[componentRef]()[0]?.context.$refs[genSubRefName(self, componentRef)] as any|Vue|Element|(Vue|Element)[]|undefined;
    }

    return self.$refs[componentRef];
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
