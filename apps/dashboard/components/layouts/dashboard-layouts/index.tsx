"use client"
import React from 'react'
import SidebarSection from './components/sidebar-section'
import HeaderSection from './components/header'
import { useRequiredSession } from '../../../hooks/use-required-session';

const DashboardLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    useRequiredSession();

    return (
        <>
            <HeaderSection />
            <section className='flex items-start'>
                <SidebarSection />
                <main>
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
                </main>
            </section>
        </>
    )
}

export default DashboardLayoutWrapper