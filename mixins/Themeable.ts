/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue from 'vue';
import {Component, Inject, Prop, Provide, Watch} from 'vue-property-decorator';
import {Dictionary} from '../generic/Dictionary';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class Themeable extends Vue {
    @Prop({type: Boolean, default: null})
    public dark!: boolean|null;

    @Prop({type: Boolean, default: null})
    public light!: boolean|null;

    @Inject({default: () => ({isDark: false}) })
    public readonly theme!: any;

    @Provide('theme')
    private provideTheme = 'themeableProvide';

    private themeableProvide: any = {
        isDark: false,
    };

    public get appIsDark(): boolean {
        return (this.$vuetify && this.$vuetify.theme.dark) || false;
    }

    public get isDark(): boolean {
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
    }

    public get themeClasses(): object {
        return {
            'theme--dark': this.isDark,
            'theme--light': !this.isDark,
        };
    }

    public get rootIsDark(): boolean {
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
    }

    public get rootThemeClasses(): Dictionary<boolean> {
        return {
            'theme--dark': this.rootIsDark,
            'theme--light': !this.rootIsDark,
        };
    }

    @Watch('isDark', {immediate: true})
    private watchIsDark(newVal?: any, oldVal?: any): void {
        if (newVal !== oldVal) {
            this.themeableProvide.isDark = this.isDark;
        }
    }
}
