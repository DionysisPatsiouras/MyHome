'use client'

import { useEffect, useState } from 'react'


// import { useSession } from 'next-auth/react'


export const useFetch = (endpoint: string, unauthenticated = false) => {


    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [DOM, setDOM] = useState(true)
    const [dataNotFound, setDataNotFound] = useState(false)

    const fetchData = () => setDOM(!DOM)
    // const { data: session, status } = useSession()


    useEffect(() => {

        const fetchData = async () => {

            try {

                const token: any = await cookieStore.get("token")

                const res = await fetch(endpoint, {
                    headers: {
                        "Content-Type": "application/json",
                        ...(unauthenticated ? {} : { Authorization: `Bearer ${token?.value}` }),
                    },
                });

                if (res.status === 404) {
                    setDataNotFound(true)
                    return
                }

                if (!res.ok) throw new Error("Failed to fetch data")

                const result = await res.json()
                if (Array.isArray(result) && result.length === 0) setDataNotFound(true)

                setData(result)

            } catch (err) {
                console.error(err)
                setDataNotFound(true)
            } finally {
                setLoading(false)
            }
        }

        fetchData()

    }, [DOM])



    return { loading, data, fetchData, dataNotFound }

}