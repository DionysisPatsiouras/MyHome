'use client'

// import axios from 'axios'

// import { useSession } from 'next-auth/react'

// import { useSnackbarContext } from '@/contexts/SnackbarContext'

// import { isEncrypted, decryptWithForgeToString } from '@/utils/decrypt'


export const useCRUD = () => {


    // const { data: session, status } = useSession()
    // const { snackbar } = useSnackbarContext()



    // const GET = async (endpoint: string, unauthorized = false) => {

    //     // if (status !== 'authenticated' && !unauthorized) return

    //     const config = {
    //         method: 'GET',
    //         url: endpoint,
    //         headers: {
    //             'Content-Type': 'application/json',
    //             // @ts-ignore
    //             ...(unauthorized ? {} : { Authorization: `Bearer ${session?.user?.token}` }),
    //         }
    //     }

    //     try {
    //         const response = await axios(config)


    //         if (isEncrypted(response.data)) {
    //             const devSecret = process.env.NEXT_PUBLIC_E2EE_SECRET

    //             try {
    //                 const plainText: any = await decryptWithForgeToString(response.data, String(devSecret))
    //                 return JSON.parse(plainText)
    //             } catch (err) {
    //                 console.warn(err, "DECRYPT FAILED")
    //                 return response.data
    //             }
    //         } else {
    //             return response.data
    //         }
    //     } catch (error) {
    //         console.error("Fetch error:", error)
    //         throw error
    //     }
    // }


    const POST = async (endpoint: string, body: any) => {

        const config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        };

        const res = await fetch(endpoint, config)

        return res.json()

        // if (status === 'authenticated') {

        // return await axios(config)
        //     .then((response) => {

        //         snackbarMessage !== '' && snackbar(snackbarMessage)

        //         return response.data
        //     })
        //     .catch((error) => {
        //         throw error
        //     })

        // }

    }

    // const POST_FILES_NO_TOKEN = async (endpoint: string, body: any) => {
    //     const config = {
    //         method: 'POST',
    //         url: endpoint,
    //         data: body,
    //         headers: {
    //             'Content-Type': 'multipart/form-data'
    //         }
    //     }
    //     return await axios(config)
    //         .then((response) => {
    //             return response.data
    //         })
    //         .catch((error) => {
    //             throw error
    //         })

    // }

    // const POST_NO_TOKEN = async (endpoint: string, body: any, snackbarMessage = 'Επιτυχής καταχώρηση', givenToken?: string) => {


    //     const config = {
    //         method: 'POST',
    //         url: endpoint,
    //         data: body,
    //         headers: {
    //             'Content-Type': 'application/json',
    //             ...(givenToken ? { Authorization: `Bearer ${givenToken}` } : {}),
    //         }
    //     }

    //     return await axios(config)
    //         .then((response) => {
    //             snackbarMessage !== '' && snackbar(snackbarMessage)

    //             return response.data
    //         })
    //         .catch((error) => {
    //             throw error
    //         })
    // }

    // const PATCH = async (endpoint: string, body: any, snackbarMessage = 'Επιτυχής ενημέρωση', unauthorized = false) => {

    //     const config = {
    //         method: 'PATCH',
    //         url: endpoint,
    //         data: body,
    //         headers: {
    //             'Content-Type': 'application/json',

    //             // @ts-ignore
    //             // Authorization: `Bearer ${session?.user?.token}`,

    //             // @ts-ignore
    //             ...(unauthorized ? {} : { Authorization: `Bearer ${session?.user?.token}` }),
    //         }
    //     }

    //     if (status === 'authenticated' || unauthorized === true) {

    //         return await axios(config)
    //             .then((response) => {

    //                 snackbarMessage !== '' && snackbar(snackbarMessage)

    //                 return response.data
    //             })
    //             .catch((error) => {
    //                 throw error
    //             })

    //     }

    // }

    // const DELETE = async (endpoint: string, snackbarMessage = 'Επιτυχής διαγραφή') => {

    //     const config = {
    //         method: 'DELETE',
    //         url: endpoint,
    //         headers: {
    //             'Content-Type': 'application/json',

    //             // @ts-ignore
    //             Authorization: `Bearer ${session?.user?.token}`,
    //         }
    //     }

    //     if (status === 'authenticated') {

    //         return await axios(config)
    //             .then((response) => {

    //                 snackbarMessage !== '' && snackbar(snackbarMessage)

    //                 return response.data
    //             })
    //             .catch((error) => {
    //                 throw error
    //             })

    //     }

    // }



    // return { GET, POST, DELETE, PATCH, POST_NO_TOKEN, POST_FILES_NO_TOKEN }
    return { POST }

}
