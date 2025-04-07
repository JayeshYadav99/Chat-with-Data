// utils/supabaseClient.ts
import { useSession } from '@clerk/nextjs'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PRIVATE_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!

export function createClerkSupabaseClient(session: any) {
    return createClient(
        supabaseUrl,
        supabaseKey,
        {
            global: {
                // Get the custom Supabase token from Clerk
                fetch: async (url, options = {}) => {
                    if (!session) {
                        console.log('No session found')
                        return fetch(url, options)
                    }
                    const clerkToken = await session?.getToken({
                        template: 'supabase',
                    })
                    console.log('clerkToken', clerkToken)

                    // Insert the Clerk Supabase token into the headers
                    const headers = new Headers(options?.headers)
                    headers.set('Authorization', `Bearer ${clerkToken}`)
                    console.log('headers', headers)
                    // Call the default fetch
                    return fetch(url, {
                        ...options,
                        headers,
                    })
                },
            },
        },
    )
}
export function createClerkSupabaseServer(clerkToken: any) {
    return createClient(
        supabaseUrl,
        supabaseServiceKey,
        {
            global: {
                // Get the custom Supabase token from Clerk
                fetch: async (url, options = {}) => {
                    if (!clerkToken) {
                        console.log('No token found')
                        return fetch(url, options)
                    }


                    // Insert the Clerk Supabase token into the headers
                    const headers = new Headers(options?.headers)
                    headers.set('Authorization', `Bearer ${clerkToken}`)

                    // Call the default fetch
                    return fetch(url, {
                        ...options,
                        headers,
                    })
                },
            },
        },
    )
}
export function createSupabaseClientInstance() {
    return createClient(
        supabaseUrl,
        supabaseKey,

    )
}
export function createSupabaseServerInstance() {
    return createClient(
        supabaseUrl,
        supabaseServiceKey,

    )
}