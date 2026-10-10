import React from 'react'
import DashboardLayoutWrapper from '../../../components/layouts/dashboard-layouts'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <DashboardLayoutWrapper>
            {children}
        </DashboardLayoutWrapper>
    )
}

export default DashboardLayout