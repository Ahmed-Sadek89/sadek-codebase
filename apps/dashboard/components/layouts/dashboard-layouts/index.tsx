"use client"
import React from 'react'
import SidebarSection from './components/sidebar-section'
import HeaderSection from './components/header'
import { SidebarInset, SidebarProvider } from '@repo/ui/sidebar';
import { useRequiredSession } from '../../../hooks/use-required-session';

const DashboardLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    useRequiredSession();

    return (
        <SidebarProvider className='flex-col'>
            <HeaderSection />
            <div className='flex flex-1'>
                <SidebarSection />
                <SidebarInset className='app-container lg:px-6 lg:py-4'>
                    {children}
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed molestiae nisi eveniet perspiciatis rem blanditiis quam voluptates nobis corrupti provident, eligendi accusamus possimus atque animi, quia in! Corporis, harum nostrum.
                </SidebarInset>
            </div>
        </SidebarProvider>
    )
}

export default DashboardLayoutWrapper