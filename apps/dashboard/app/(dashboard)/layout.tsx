import React from 'react'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <h1>wrapper</h1>
            {children}
        </>
    )
}

export default DashboardLayout