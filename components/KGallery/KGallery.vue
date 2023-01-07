<template>
    <div
        v-bind="$attrs"
        v-on="$listeners"
        ref="gallery"
        :class="genClasses"
    >
        <slot
            name="default"
            v-bind="genSlotProps"
        />
    </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from '@vue/composition-api';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import 'photoswipe/style.css';
import {PhotoSwipeOptions, AugmentedEvent} from 'photoswipe';
import {deepMerge} from '@klipper/bow/utils/object';
import {CancelerBag} from '@klipper/http-client/CancelerBag';
import {ContentConfig} from '@klipper/bow/api/ContentConfig';
import {Canceler} from '@klipper/http-client/Canceler';
/* @ts-ignore-start */
import PhotoSwipeLightbox from 'photoswipe/lightbox';
/* @ts-ignore-end */

export default defineComponent({
    name: 'KGallery',

    props: {
        items: {
            type: Array,
            default: () => ([]),
        },

        mode: {
            type: String,
        },

        keepOriginal: {
            type: Boolean,
        },

        maxWidth: {
            type: Number,
            default: 4000,
        },

        maxHeight: {
            type: Number,
            default: 4000,
        },

        scale: {
            type: Number,
        },

        itemValue: {
            type: String,
            default: 'id',
        },

        itemImage: {
            type: String,
            default: 'image',
        },

        itemWidth: {
            type: String,
            default: 'width',
        },

        itemHeight: {
            type: String,
            default: 'height',
        },

        itemUrl: {
            type: String,
            default: 'file_url',
        },

        itemOriginAttrSelector: {
            type: String,
            default: 'data-gallery-id',
        },

        itemOriginSubSelector: {
            type: String,
        },

        photoswipeOptions: {
            type: Object as PropType<PhotoSwipeOptions>,
        },

        photoswipePreInitFunction: {
            type: Function as PropType<(photoswipe: PhotoSwipeLightbox) => void>,
        },
    },

    data(): Dictionary<any> {
        return {
            photoswipe: undefined as PhotoSwipeLightbox|undefined,
            previousRequests: new CancelerBag() as CancelerBag,
        };
    },

    computed: {
        genClasses(): Dictionary<any> {
            return {
                'a-gallery': true,
                'pswp-gallery': true,
                'pswp-gallery--single-column': false,
            };
        },

        genSlotProps(): Dictionary<any> {
            return {
                photoswipe: this.photoswipe,
                photoswipeEl: this.$refs.gallery,
            };
        },

        genImageItems(): Array<Dictionary<any>> {
            return this.items.filter((item: Dictionary<any>) => [undefined, true].includes(item[this.itemImage]));
        },
    },

    mounted(): void {
        this.initPhotoswipe();
    },

    beforeUpdate() {
        this.resetPhotoswipe();
    },

    destroyed(): void {
        this.destroyPhotoswipe();
    },

    methods: {
        loadAndOpen(id: number|string): void {
            const index = this.genImageItems.findIndex((item: Dictionary<any>) => id === item[this.itemValue]);

            if (index >= 0) {
                this.photoswipe.loadAndOpen(index);
            }
        },

        initPhotoswipe(): void {
            if (this.photoswipe) {
                return;
            }

            this.photoswipe = new PhotoSwipeLightbox(deepMerge({}, {
                gallery: this.$refs.gallery.$el,
                dataSource: this.genImageItems,
                closeTitle: this.$t('component.gallery.close-title') as string,
                zoomTitle: this.$t('component.gallery.zoom-title') as string,
                arrowPrevTitle: this.$t('component.gallery.arrow-previous-title') as string,
                arrowNextTitle: this.$t('component.gallery.arrow-next-title') as string,
                errorMsg: this.$t('component.gallery.error-message') as string,
                pswpModule: () => import('photoswipe'),
            }, this.photoswipeOptions || {}));

            this.photoswipe.addFilter('thumbEl', (thumbEl: HTMLElement|undefined, data: Dictionary<any>, priority: number) => {
                const selector = `[${this.itemOriginAttrSelector}="${data[this.itemValue]}"]`;

                return document.querySelector(selector) || thumbEl;
            });

            this.photoswipe.addFilter('placeholderSrc', (placeholderSrc: string, content: Dictionary<any>): string|false => {
                const selector = `[${this.itemOriginAttrSelector}="${content?.data[this.itemValue]}"]`;
                let el = document.querySelector(selector);

                if (el && this.itemOriginSubSelector) {
                    el = el.querySelector(this.itemOriginSubSelector) || el;
                }

                if (el?.src) {
                    return el.src;
                }

                let bgImg: string|undefined = undefined;

                if (el?.style?.backgroundImage) {
                    bgImg = el.style.backgroundImage;
                }

                if (bgImg && bgImg.startsWith('url("')) {
                    bgImg = bgImg.substring(5);
                    bgImg = bgImg.substring(0, bgImg.length - 2);
                }

                return bgImg || placeholderSrc;
            });

            this.photoswipe.on('contentLoad', (e: AugmentedEvent<any>) => {
                const {content} = e;
                const canceler = new Canceler();
                const dataWidth = content?.data[this.itemWidth];
                const dataHeight = content?.data[this.itemHeight];
                const dataUrl = content?.data[this.itemUrl];
                const imgEl = document.createElement('img');

                e.preventDefault();

                imgEl.setAttribute('alt', '');
                imgEl.className = 'pswp__img';

                content.element = imgEl;
                content.type = 'image';
                content.state = 'loading';

                if (undefined !== dataWidth) {
                    content.displayedImageWidth = dataWidth;
                    content.width = dataWidth;
                }

                if (undefined !== dataHeight) {
                    content.displayedImageHeight = dataHeight;
                    content.height = dataHeight;
                }

                this.$downloader.downloadContent((this.$el as HTMLElement), {
                    src: dataUrl,
                    mode: this.mode,
                    keepOriginal: this.keepOriginal ? true : undefined,
                    width: this.maxWidth,
                    height: this.maxHeight,
                    scale: this.scale,
                } as ContentConfig, canceler)
                    .then((base64Image: string) => {
                        content.element.src = base64Image;
                        content.onLoaded();
                    })
                    .catch(() => {
                        content.onError();
                    }).finally(() => {
                        this.previousRequests.remove(canceler);
                    });
            });

            if (this.photoswipePreInitFunction) {
                this.photoswipePreInitFunction(this.photoswipe);
            }

            this.photoswipe.init();
        },

        destroyPhotoswipe(): void {
            this.previousRequests.cancelAll();

            if (this.photoswipe) {
                this.photoswipe.destroy();
                this.photoswipe = undefined;
            }
        },

        resetPhotoswipe(): void {
            this.destroyPhotoswipe();
            this.initPhotoswipe();
        },
    },

    watch: {
        genImageItems: {
            handler(): void {
                this.resetPhotoswipe();
            },
        },
    },
});
</script>
