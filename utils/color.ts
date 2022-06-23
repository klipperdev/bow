/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Check if the color is a css color.
 */
export function isCssColor(color?: string|false): boolean {
    return !!color && !!color.match(/^(#|var\(--|(rgb|hsl)a?\()/);
};

export function getContrastYiq(hexColor: string, darkColor: string = 'black', lightColor: string = 'white'): string {
    hexColor = hexColor.replace('#', '');

    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

    return (yiq >= 128) ? darkColor : lightColor;
};
