/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {VForm} from '@klipper/bow/vuetify/VForm';
import Vue, {ComponentOptions} from 'vue';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export const FormContent: ComponentOptions<Vue|any> = {
    name: 'formContent',

    methods: {
        /**
         * Get the v-form component.
         *
         * @param {string} [name] The ref name of the v-form component, by default 'form'
         *
         * @throws Error When the ref is not found
         */
        getForm(name?: string): VForm {
            return this.findForm(this, name);
        },

        /**
         * Check if the form is valid.
         *
         * @param {boolean} [autoValidation] Check if the form must be validate just before
         * @param {string}  [name]           The ref name of the v-form component, by default 'form'
         *
         * @return {boolean}
         */
        isValidForm(autoValidation?: boolean, name?: string): boolean {
            const form = this.getForm(name);

            if (undefined === autoValidation || autoValidation) {
                return form.validate();
            }

            return form.value;
        },

        /**
         * Validate the form.
         *
         * @param {string} [name] The ref name of the v-form component, by default 'form'
         *
         * @return {boolean}
         */
        validateForm(name?: string): boolean {
            return this.getForm(name).validate();
        },

        /**
         * Reset the form.
         *
         * @param {string} [name] The ref name of the v-form component, by default 'form'
         */
        resetForm(name?: string): void {
            this.getForm(name).reset();
        },

        /**
         * Reset the validation of the form.
         *
         * @param {string} [name] The ref name of the v-form component, by default 'form'
         */
        resetFormValidation(name?: string): void {
            this.getForm(name).resetValidation();
        },

        /**
         * Reset the field values of the form.
         *
         * Vee validate detects a null value as an entered value
         * and the properties must be initialized with a value.
         *
         * To remove the error messages, the values must be undefined
         *
         * @param {string[]} properties The list of properties
         */
        resetFormFields(properties: string[]): void {
            properties.forEach((property: string) => {
                (this as any)[property] = undefined;
            });
        },

        findForm(node: Vue, name?: string): VForm {
            name = name || 'form';
            const form = node.$refs[name];

            if (!form) {
                if (node.$parent) {
                    return this.findForm(node.$parent, name);
                }

                throw new Error(`The form with the ref "${name}" does not exist in the component`);
            }

            return form as VForm;
        },
    },
};
