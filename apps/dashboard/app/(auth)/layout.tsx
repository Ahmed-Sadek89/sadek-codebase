import React from 'react'
import AuthPageLayoutWrapper from '../../components/layouts/auth-pages-layouts'

const AuthPageLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <AuthPageLayoutWrapper>
            {children}
        </AuthPageLayoutWrapper>
    )
}

export default AuthPageLayout