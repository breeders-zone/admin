export interface ILoginData {
    email: string,
    password: string
}


export interface IAdminData {
    name: string,
    surname: string,
    email: string|null,
    change_password: boolean|null,
    password: string|null,
    old_password: string|null,
    password_confirmation: string|null
}

export interface ISetFaqData {
    label: string,
    title: string,
    description: string|null
}

export interface IUpdateFaqData {
    label: string|null,
    title: string,
    description: string|null
}

export interface ISetDocumentData {
    label: string,
    title: string,
    description: string|null
}

export interface IUpdateDocumentData {
    label: string|null,
    title: string,
    description: string|null
}
