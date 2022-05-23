/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {ThemeableProvide} from '@klipper/bow/themer/ThemeableProvide';
import Vue, {ComponentOptions} from 'vue';
import {PropType} from 'vue/types/options';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */

interface Props {
    dark: boolean|null;
    light: boolean|null;
}

interface Data {
    themeableProvide: {
        isDark: boolean,
    }
}

interface Computed {
    get appIsDark(): boolean;
    get isDark(): boolean;
    get themeClasses(): Dictionary<boolean>;
    get rootIsDark(): boolean;
    get rootThemeClasses(): Dictionary<boolean>;
}

export const Themeable = Vue.extend<Data, {}, Computed, Props>({
    name: 'themeable',

    props: {
        dark: {
            type: Boolean as PropType<boolean|null>,
            default: null,
        },

        light: {
            type: Boolean as PropType<boolean|null>,
            default: null,
        },
    },

    inject: {
        theme: {
            default: {
                isDark: false,
            },
        },
    },

    provide() {
        return {
            theme: this.themeableProvide,
        };
    },

    data() {
        return {
            themeableProvide: {
                isDark: false,
            },
        };
    },

    computed: {
        appIsDark(): boolean {
            return (this.$vuetify && this.$vuetify.theme.dark) || false;
        },

        isDark(): boolean {
            if (this.dark === true) {
                // explicitly dark
                return true;
            } else if (this.light === true) {
                // explicitly light
                return false;
            } else {
                // inherit from parent, or default false if there is none
                return this.theme.isDark;
            }
        },

        themeClasses(): Dictionary<boolean> {
            return {
                'theme--dark': this.isDark,
                'theme--light': !this.isDark,
            };
        },

        rootIsDark(): boolean {
            if (this.dark === true) {
                // explicitly dark
                return true;
            } else if (this.light === true) {
                // explicitly light
                return false;
            } else {
                // inherit from app
                return this.appIsDark;
            }
        },

        rootThemeClasses(): Dictionary<boolean> {
            return {
                'theme--dark': this.rootIsDark,
                'theme--light': !this.rootIsDark,
            };
        },
    },

    watch: {
        isDark: {
            immediate: true,
            handler(newVal?: any, oldVal?: any): void {
                if (newVal !== oldVal) {
                    this.themeableProvide.isDark = this.isDark;
                }
            },
        },
    },
});
