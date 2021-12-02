export const getFormFields = (formState: object) => {
    const fields = []
    for (let field in formState) {
        fields.push(field)
    }
    return fields || []
}