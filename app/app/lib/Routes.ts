const prefix = process.env.NEXT_PUBLIC_API_ENDPOINT
// const socketPrefix = process.env.NEXT_PUBLIC_SOCKET_ENDPOINT



const generateParams = (paramsObj: any) => {

    let allParams = ''


    for (const index in Object.keys(paramsObj)) {

        const param = Object.keys(paramsObj)[index]
        const value = Object.values(paramsObj)[index]

        const checkIfLastElement = () => {
            return Number(index) + 1 !== Object.keys(paramsObj).length ? '&' : ''
        }

        allParams += `${param}=${value}${checkIfLastElement()}`

    }

    return allParams

}

export const Routes = (resourceName: string) => ({
    id: (id: string) => `${prefix}/${resourceName}/${id}`,
    list: `${prefix}/${resourceName}`,
    add: `${prefix}/${resourceName}/handler/add`,
    patch: (id: string) => `${prefix}/${resourceName}/handler/patch/${id}`,
    delete: (id: string) => `${prefix}/${resourceName}/handler/delete/${id}`,
    hardDelete: (id: string) => `${prefix}/${resourceName}/handler/hardDelete/${id}`,
    filters: (paramsObj: any) =>
        `${prefix}/${resourceName}/filtering/filters?${generateParams(paramsObj)}`
})

export const AuthRoutes = {
    signin: `${prefix}/auth/token/`,
}

export const customRoute = (endpoint: string) => `${prefix}/${endpoint}`

// export const SocketRoutes = {
//   endpoint: `${socketPrefix}`
// }
