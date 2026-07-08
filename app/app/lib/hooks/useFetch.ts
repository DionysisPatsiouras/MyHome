'use client'

import { useEffect, useState } from 'react'

// import axios from 'axios'

// import { useSession } from 'next-auth/react'



export const useFetch = (endpoint: string) => {


    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [DOM, setDOM] = useState(true)
    const [dataNotFound, setDataNotFound] = useState(false)

    const fetchData = () => setDOM(!DOM)
    // const { data: session, status } = useSession()


    useEffect(() => {
        // Define async function inside the effect
        const fetchData = async () => {

            try {
                // const token = localStorage.getItem("token");
                const token: any = await cookieStore.get("token")
                // console.log("🚀 ~ fetchData ~ token:", token)

                const res = await fetch(endpoint, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token?.value}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch data");

                const result = await res.json();
                setLoading(false)
                setData(result);
            } catch (err) {
                console.error(err);
            }
        };

        // Call the async function
        fetchData();
    }, [DOM]); // empty dependency array = run once on mount



    return { loading, data, fetchData, dataNotFound }

}