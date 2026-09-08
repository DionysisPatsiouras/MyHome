const prefix = process.env.NEXT_PUBLIC_API_ENDPOINT
const websocketPrefix = process.env.NEXT_PUBLIC_WS_ENDPOINT
    ?? (prefix ? prefix.replace(/^http/, 'ws') : '')
// const socketPrefix = process.env.NEXT_PUBLIC_SOCKET_ENDPOINT

type QueryParams = Record<string, unknown>


const generateParams = (paramsObj: QueryParams) => {

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
    add: `${prefix}/${resourceName}/`,
    patch: (id: string) => `${prefix}/${resourceName}/${id}`,
    delete: (id: string) => `${prefix}/${resourceName}/${id}`,
    // hardDelete: (id: string) => `${prefix}/${resourceName}/handler/hardDelete/${id}`,
    overview: (id: string) => `${prefix}/${resourceName}/overview/${id}`,
    filters: (paramsObj: QueryParams) =>
        `${prefix}/${resourceName}/filtering/filters?${generateParams(paramsObj)}`
})

export const AuthRoutes = {
    signin: `${prefix}/auth/token/`,
    forgotPassword: `${prefix}/auth/forgot-password`,
    resendVerification: `${prefix}/auth/resend-verification`,
    verifyEmail: `${prefix}/auth/verify-email`
}

export const NotificationRoutes = {
    list: `${prefix}/notifications/`,
    detail: (id: number | string) => `${prefix}/notifications/${id}`,
    unreadCount: `${prefix}/notifications/unread-count`,
    readAll: `${prefix}/notifications/read-all`,
    socket: websocketPrefix ? `${websocketPrefix}/ws/notifications/` : '',
}


export const customRoute = (endpoint: string) => `${prefix}/${endpoint}`

// export const SocketRoutes = {
//   endpoint: `${socketPrefix}`
// }
