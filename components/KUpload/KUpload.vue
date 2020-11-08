<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KUpload.ts" />

<style lang="css" src="@uppy/core/dist/style.css"/>
<style lang="css" src="@uppy/dashboard/dist/style.css"/>
<style lang="scss" src="./KUpload.scss" />

<template>
    <div
        :id="uploaderId"
        :class="classes"
        :key="uploaderId"
    >
        <slot
            name="default"
            :inline="inline"
            :open="openModal"
        ></slot>
    </div>
</template>
