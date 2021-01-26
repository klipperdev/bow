/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export function getEmailLink(email?: string, cc?: string, bcc?: string, subject?: string, body?: string): string|undefined {
    return undefined !== email ? 'mailto:' + email + getEmailLinkQueries(cc, bcc, subject, body) : undefined;
}

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function getEmailLinkQueries(cc?: string, bcc?: string, subject?: string, body?: string): string {
    let query = '';

    if (!!cc) {
        query += '&cc=' + encodeURIComponent(cc);
    }

    if (!!bcc) {
        query += '&bcc=' + encodeURIComponent(bcc);
    }

    if (!!subject) {
        query += '&subject=' + encodeURIComponent(subject);
    }

    if (!!body) {
        query += '&body=' + encodeURIComponent(body + '\n\n');
    }

    if (!!query) {
        query = '?' + query.replace(/^&/, '');
    }

    return query;
}
