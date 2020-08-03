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
}
