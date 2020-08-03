/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vuetify from 'vuetify/lib';

const classifyRE = /(?:^|[-_])(\w)/g;

function classify(str: string): string {
    return str
        .replace(classifyRE, (c) => c.toUpperCase())
        .replace(/[-_]/g, '');
}

function createMessage(message: string, vm?: any, parent?: any): string | void {
    if (Vuetify.config.silent) {
        return;
    }

    if (parent) {
        vm = {
            _isVue: true,
            $parent: parent,
            $options: vm,
        };
    }

    if (vm) {
        // Only show each message once per instance
        vm.$_alreadyWarned = vm.$_alreadyWarned || [];

        if (vm.$_alreadyWarned.includes(message)) {
            return;
        }

        vm.$_alreadyWarned.push(message);
    }

    return `[Klipper] ${message}` + (
        vm ? generateComponentTrace(vm) : ''
    );
}

function generateComponentTrace(vm: any): string {
    if (vm._isVue && vm.$parent) {
        const tree: any[] = [];
        let currentRecursiveSequence = 0;

        while (vm) {
            if (tree.length > 0) {
                const last: any = tree[tree.length - 1];

                if (last.constructor === vm.constructor) {
                    currentRecursiveSequence++;
                    vm = vm.$parent;

                    continue;
                } else if (currentRecursiveSequence > 0) {
                    tree[tree.length - 1] = [last, currentRecursiveSequence];
                    currentRecursiveSequence = 0;
                }
            }
            tree.push(vm);
            vm = vm.$parent;
        }
        return '\n\nfound in\n\n' + tree
            .map((vm, i) => `${
                i === 0 ? '---> ' : ' '.repeat(5 + i * 2)
            }${
                Array.isArray(vm)
                    ? `${formatComponentName(vm[0])}... (${vm[1]} recursive calls)`
                    : formatComponentName(vm)
            }`)
            .join('\n');
    } else {
        return `\n\n(found in ${formatComponentName(vm)})`;
    }
}

function formatComponentName(vm: any, includeFile?: boolean): string {
    if (vm.$root === vm) {
        return '<Root>';
    }

    const options = typeof vm === 'function' && vm.cid != null
        ? vm.options
        : vm._isVue
            ? vm.$options || vm.constructor.options
            : vm || {};
    let name = options.name || options._componentTag;
    const file = options.__file;

    if (!name && file) {
        const match = file.match(/([^/\\]+)\.vue$/);
        name = match && match[1];
    }

    return (
        (name ? `<${classify(name)}>` : `<Anonymous>`) +
        (file && includeFile !== false ? ` at ${file}` : '')
    );
}

export function consoleInfo(message: string, vm?: any, parent?: any): void {
    const newMessage = createMessage(message, vm, parent);

    if (null !== newMessage) {
        console.info(newMessage);
    }
}

export function consoleWarn(message: string, vm?: any, parent?: any): void {
    const newMessage = createMessage(message, vm, parent);

    if (null !== newMessage) {
        console.warn(newMessage);
    }
}

export function consoleError(message: string, vm?: any, parent?: any): void {
    const newMessage = createMessage(message, vm, parent);

    if (null !== newMessage) {
        console.error(newMessage);
    }
}
