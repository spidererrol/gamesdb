// ### FUNCTIONS ###


export function isKnown(value?: any | null): value is any {
    if (value === undefined) return false
    if (value === null) return false
    return true
}

export function isKnown_type<T>(value?: T | null): value is T {
    if (value === undefined) return false
    if (value === null) return false
    return true
}

// ### Environment ###

interface has_toString {
    toString(): string
};

export function isStringable(value: has_toString | undefined): value is has_toString {
    if (typeof value === 'undefined') return false
    if ((value as has_toString).toString) {
        return true
    }
    return false
}

export function safeToString(thing?: has_toString): string | undefined {
    if (isStringable(thing)) {
        return thing.toString()
    }
    return undefined
}
