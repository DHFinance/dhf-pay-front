export const getFormFields = (formState: object) => {
    const fields = []
    for (let field in formState) {
        console.log(field)
        fields.push(field)
    }
    return fields || []
}