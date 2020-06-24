/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 *  Remove the redirect query parameter.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function cleanRedirect(url: string): string {
    const match = url.match(/(([^:\/?#]*)(?::([0-9]+))?)([\/]?[^?#]*)(\?[^#]*|)(#.*|)$/);

    if (match && match[5]) {
        const queries = match[5]
            .replace(/^\?/, '')
            .split('&')
            .map((item) => item.split('='))
            .reduce((prev, curr) => ({
                ...prev,
                [curr[0]]: curr[1],
            }), {}) as Partial<any>;

        if (queries.redirect) {
            delete queries.redirect;
        }

        const queriesStr = Object.keys(queries).map((key) => key + '=' + queries[key]).join('&');

        url = match[4];
        url += (queriesStr ? ('?' + queriesStr) : '');
        url += (match[6] ? ('#' + match[6]) : '');
    }

    return url;
}
