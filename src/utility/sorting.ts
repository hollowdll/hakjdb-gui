export const sortAlphabetically = (items: string[]) => {
    items.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
}