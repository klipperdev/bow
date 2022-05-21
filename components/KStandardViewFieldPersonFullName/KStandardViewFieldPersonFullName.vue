<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <k-col-label
        :label="self.$mfl(metadataName, 'full_name')"
        :edit-mode="standardData.editMode"
        edit-label-required
    >
        <template v-slot:read>
            <slot name="read" v-bind="standardData">
                {{ getName(standardData.data) }}
            </slot>

            <slot name="read.append" v-bind="standardData"/>
        </template>

        <template v-slot:edit>
            <v-row>
                <v-col
                    cols="12"
                    xl="3"
                    class="pt-0 pb-0"
                >
                    <k-standard-view-field-association-choice
                        name="salutation"
                        unwrap
                    />
                </v-col>

                <v-col
                    cols="12"
                    md="6"
                    xl="4"
                    class="pt-0 pb-0"
                >
                    <k-standard-view-field-text
                        name="first_name"
                        unwrap
                        autofocus
                    />
                </v-col>

                <v-col
                    cols="12"
                    md="6"
                    xl="5"
                    class="pt-0 pb-0"
                >
                    <k-standard-view-field-text
                        name="last_name"
                        unwrap
                        :required="undefined !== $attrs.required ? $attrs.required : undefined"
                    />
                </v-col>
            </v-row>
        </template>
    </k-col-label>
</template>

<script lang="ts">
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {Selfable} from '@klipper/bow/mixins/Selfable';
import {StandardViewItem} from '@klipper/bow/mixins/StandardViewItem';
import {mixins} from 'vue-class-component';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KStandardViewFieldPersonFullName extends mixins(
    Selfable,
    StandardViewItem,
) {
    protected getName(data: Dictionary<any>): string {
        return (
            data?.salutation?.label + (!!data?.salutation ? ' ' : '')
            + data?.full_name
        ).trim();
    }
}
</script>
