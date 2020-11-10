/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Generate a random number between 2 numbers.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function randomNumberBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Check if a value is a number.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function isNumber(value: any): boolean {
    if (typeof value !== 'string') {
        return false;
    }

    return !isNaN(value as any) && !isNaN(parseFloat(value));
}
