import React from 'react'
import { dehydrate, getQueryClient, HydrationBoundary } from '@repo/libs/query'
import { queryKeys } from '@repo/utils/query-keys'
import { Header } from '../../../components/layout/header'
import { Footer } from '../../../components/layout/footer'
import { getPublicUserInfo } from '../../../libs/seo/user-info'

const HomepageLayout = async ({ children }: { children: React.ReactNode }) => {
    // The header and footer show the owner's name and avatar (GET /user-info/public).
    // getPublicUserInfo is React-cached, so this shares the page's request.
    const queryClient = getQueryClient()
    await queryClient
        .query({
            queryKey: queryKeys.userInfo.public(),
            queryFn: getPublicUserInfo,
        })
        .catch(() => { })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Header />
            <main>
                {children}
            </main>
            <Footer />
        </HydrationBoundary>
    )
}

export default HomepageLayout
