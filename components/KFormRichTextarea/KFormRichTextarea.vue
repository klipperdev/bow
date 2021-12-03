<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KFormRichTextarea.ts" />

<style lang="scss" src="./KFormRichTextarea.scss" />

<template>
    <div
        ref="editor"
        v-bind="$attrs"
        v-on="$listeners"
        :class="genClasses"
    >
        <slot name="toolbar"></slot>

        <div
            ref="editor"
        >
            <slot name="content"/>
        </div>

        <slot name="default"/>
    </div>
</template>
