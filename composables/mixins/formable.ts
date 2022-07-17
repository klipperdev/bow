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
                return getRefComponentWithProperty(this, componentRef, 'hasError')?.hasError || false;
            },

            hasSuccess(): boolean {
                return getRefComponentWithProperty(this, componentRef, 'hasSuccess')?.hasSuccess || false;
            },

            externalError(): boolean {
                return getRefComponentWithProperty(this, componentRef, 'externalError')?.externalError || false;
            },

            hasMessages(): boolean {
                return getRefComponentWithProperty(this, componentRef, 'hasMessages')?.hasMessages || false;
            },

            hasState(): boolean {
                return getRefComponentWithProperty(this, componentRef, 'hasState')?.hasState || false;
            },

            isDisabled(): boolean {
                return getRefComponentWithProperty(this, componentRef, 'isDisabled')?.isDisabled || false;
            },

            isInteractive(): boolean {
                return getRefComponentWithProperty(this, componentRef, 'isInteractive')?.isInteractive || false;
            },

            isReadonly(): boolean {
                return getRefComponentWithProperty(this, componentRef, 'isReadonly')?.isReadonly || false;
            },

            shouldValidate(): boolean {
                return getRefComponentWithProperty(this, componentRef, 'shouldValidate')?.shouldValidate || false;
            },

            validations(): InputValidationRules {
                return getRefComponentWithProperty(this, componentRef, 'validations')?.validations || [];
            },

            validationState(): string|undefined {
                return getRefComponentWithProperty(this, componentRef, 'validationState')?.validationState;
            },

            validationTarget(): InputValidationRules {
                return getRefComponentWithProperty(this, componentRef, 'validationTarget')?.validationTarget || [];
            },
        },

        methods: {
            blur (e?: Event): void {
                getRefComponentWithProperty(this, componentRef, 'blur')?.blur(e);
            },

            focus(): void {
                getRefComponentWithProperty(this, componentRef, 'focus')?.focus();
            },

            reset(): void {
                getRefComponentWithProperty(this, componentRef, 'reset')?.reset();
            },

            clearableCallback(): void {
                getRefComponentWithProperty(this, componentRef, 'clearableCallback')?.clearableCallback();
            },

            validate(force = false, value?: any): boolean {
                return getRefComponentWithProperty(this, componentRef, 'validate')?.validate(force, value) || false;
            },

            resetValidation(): void {
                const ref = getRefComponentWithProperty(this, componentRef, 'resetValidation')?.resetValidation();
            },

            setValue(value?: any): void {
                getRefComponentWithProperty(this, componentRef, 'setValue')?.setValue(value);
            },
        },
    });
}

export function ajaxListFormable(componentRef: string): VueConstructor {
    return Vue.extend({
        name: 'AjaxListFormable',

        computed: {
            page(): number {
                return getRefComponentWithProperty(this, componentRef, 'page')?.page || 1;
            },

            limit(): number {
                return getRefComponentWithProperty(this, componentRef, 'limit')?.limit || this.$klipper?.defaultItemPerPage || 20;
            },

            pages(): number {
                return getRefComponentWithProperty(this, componentRef, 'pages')?.pages || -1;
            },

            total(): number {
                return getRefComponentWithProperty(this, componentRef, 'total')?.total || 0;
            },

            search(): string {
                return getRefComponentWithProperty(this, componentRef, 'search')?.search || '';
            },
        },

        methods: {
            cancel(): void {
                getRefComponentWithProperty(this, componentRef, 'cancel')?.cancel();
            },

            reset(): void {
                getRefComponentWithProperty(this, componentRef, 'reset')?.reset();
            },

            async previousPage(): Promise<void> {
                await getRefComponentWithProperty(this, componentRef, 'previousPage')?.previousPage();
            },

            async nextPage(): Promise<void> {
                await getRefComponentWithProperty(this, componentRef, 'nextPage')?.nextPage();
            },

            async refreshToFirstPage(): Promise<void> {
                await getRefComponentWithProperty(this, componentRef, 'refreshToFirstPage')?.refreshToFirstPage();
            },

            deleteItem(value: string|number, key: string): number {
                return getRefComponentWithProperty(this, componentRef, 'deleteItem')?.deleteItem(value, key) || 0;
            },

            async refresh(showSnackbar: boolean, topOnRefresh: boolean): Promise<void> {
                await getRefComponentWithProperty(this, componentRef, 'refresh')?.refresh(showSnackbar, topOnRefresh);
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
                await getRefComponentWithProperty(this, componentRef, 'initValue')?.initValue(value);
            },

            setValue<T = any>(value?: T): void {
                getRefComponentWithProperty(this, componentRef, 'setValue')?.setValue(value);
            },

            setValueByText<T = any>(value?: T, defaultValue: T|null = null): void {
                getRefComponentWithProperty(this, componentRef, 'setValueByText')?.setValueByText(value, defaultValue);
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

const getRefComponentWithProperty = function(self: Vue|any, componentRef: string, requiredProperty: string): any|Vue|Element|(Vue|Element)[]|undefined {
    const component = getRefComponent(self, componentRef);

    return undefined !== component && undefined !== component[requiredProperty]
        ? component
        : undefined;
};

const getRefComponent = function(self: Vue|any, componentRef: string): any|Vue|Element|(Vue|Element)[]|undefined {
    if (self.$scopedSlots[componentRef]) {
        const scopedSlot = self.$scopedSlots[componentRef]();

        return undefined === scopedSlot
            ? undefined
            : scopedSlot[0]?.context?.$refs[genSubRefName(self, componentRef)] as any|Vue|Element|(Vue|Element)[]|undefined;
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
