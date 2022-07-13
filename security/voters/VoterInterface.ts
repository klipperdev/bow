/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface VoterInterface {
    /**
     * Determines if the attribute and subject are supported by this voter.
     *
     * @param {string} attribute An attribute
     * @param {any}    [subject] The subject to secure, e.g. an object the user wants to access or any other metadata type
     */
    supports(attribute: string, subject?: any): boolean;

    /**
     * Perform a single access check operation on a given attribute and subject.
     * It is safe to assume that attribute and subject already passed the "supports()" method check.
     *
     * @param {string} attribute An attribute
     * @param {any}    [subject] The subject to secure, e.g. an object the user wants to access or any other metadata type
     */
    voteOnAttribute(attribute: string, subject?: any): boolean;
}
