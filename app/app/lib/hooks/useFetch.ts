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

                if (!res.ok) throw new Error("Failed to fetch data")

                const result = await res.json()
                result.length === 0 && setDataNotFound(true)

                setLoading(false)
                setData(result)

            } catch (err) {
                console.error(err)
            }
        }

        fetchData()

    }, [DOM])



    return { loading, data, fetchData, dataNotFound }

}