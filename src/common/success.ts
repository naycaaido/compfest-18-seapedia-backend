export const enum SuccessMessageType {
    REMOVE = 'Successfully removed the',
    CREATE = 'Successfully created the',
    ADD = 'Successfully added the',
    UPDATE = 'Successfully updated the',
    RETRIEVE = 'Successfully retrieved the',
    CANCEL = 'Successfully canceled the',
    DEFAULT = 'Successfully',
}
export const successMessageGlobal = (type: SuccessMessageType, value: string) => {
    return `${type} ${value}`;
};