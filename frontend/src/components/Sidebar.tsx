import {useNavigate} from "react-router-dom";
import {routes} from "/src/utils/Routes.ts";
import {Fragment, useContext, useState} from "react";
import {AuthContext} from "/src/context/AuthContext.tsx";
import {Dialog, Transition} from '@headlessui/react'
import {
    Bars3Icon,
    CalendarIcon,
    ChartPieIcon,
    DocumentDuplicateIcon,
    FolderIcon,
    HomeIcon,
    UsersIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPowerOff} from "@fortawesome/free-solid-svg-icons";

const navigation = [
    {name: 'Dashboard', href: routes.DASHBOARD, icon: HomeIcon, current: true},
    {name: 'Profile', href: routes.PROFILE, icon: UsersIcon, current: false},
    {name: 'Taxes', href: routes.TAX, icon: FolderIcon, current: false},
    {name: 'Customers', href: routes.CUSTOMER, icon: CalendarIcon, current: false},
    {name: 'Invoices', href: routes.INVOICE, icon: DocumentDuplicateIcon, current: false},
    {name: 'Payments', href: routes.PAYMENT, icon: ChartPieIcon, current: false},
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export const Sidebar = () => {

    const navigate = useNavigate()

    const {logOut} = useContext(AuthContext)

    const [selectedNavigation, setSelectedNavigation] = useState(navigation)

    const handleLogOut = () => {
        logOut()
        navigate(routes.LOGIN)
    }

    const navigatePage = (name: string, route: string) => {

        setSelectedNavigation((prevNav) =>
            prevNav.map((item) => ({
                ...item,
                current: item.name === name
            })))

        navigate(route)

    }

    const [sidebarOpen, setSidebarOpen] = useState(false)


    return (
        <>

            <Transition.Root show={sidebarOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-900/80"/>
                    </Transition.Child>

                    <div className="fixed inset-0 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                        <button type="button" className="-m-2.5 p-2.5"
                                                onClick={() => setSidebarOpen(false)}>
                                            <span className="sr-only">Close sidebar</span>
                                            <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true"/>
                                        </button>
                                    </div>
                                </Transition.Child>
                                {/* Sidebar component, swap this element with another sidebar if you like */}
                                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                                    <div className="flex h-16 shrink-0 items-center">
                                        <img
                                            className="h-8 w-auto"
                                            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                                            alt="Your Company"
                                        />
                                    </div>
                                    <nav className="flex flex-1 flex-col">
                                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                            <li>
                                                <ul role="list" className="-mx-2 space-y-1">
                                                    {navigation.map((item) => (
                                                        <li key={item.name}>
                                                            <span
                                                                onClick={() => navigatePage(item.name, item.href)}
                                                                className={classNames(
                                                                    item.current
                                                                        ? 'bg-gray-50 text-indigo-600'
                                                                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                                                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                                )}
                                                            >
                                                                <item.icon
                                                                    className={classNames(
                                                                        item.current ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                                                                        'h-6 w-6 shrink-0'
                                                                    )}
                                                                    aria-hidden="true"
                                                                />
                                                                {item.name}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Static sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
                    <div className="flex h-16 shrink-0 items-center">
                        <img
                            className="h-8 w-auto"
                            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                            alt="Your Company"
                        />
                    </div>
                    <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul role="list" className="-mx-2 space-y-1">
                                    {selectedNavigation.map((item) => (
                                        <li key={item.name}>
                                            <span
                                                onClick={() => navigatePage(item.name, item.href)}
                                                className={classNames(
                                                    item.current
                                                        ? 'bg-gray-50 text-indigo-600'
                                                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                )}
                                            >
                                                <item.icon
                                                    className={classNames(
                                                        item.current ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                                                        'h-6 w-6 shrink-0'
                                                    )}
                                                    aria-hidden="true"
                                                />
                                                {item.name}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            <li className="-mx-6 mt-auto">
                                <a
                                    href="#"
                                    className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
                                >
                                    <img
                                        className="h-8 w-8 rounded-full bg-gray-50"
                                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                        alt=""
                                    />
                                    <span className="sr-only">Your profile</span>
                                    <span aria-hidden="true">Tom Cook</span>
                                    <span aria-hidden="true" onClick={handleLogOut}>
                                        <FontAwesomeIcon icon={faPowerOff}/>
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            <div
                className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
                <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                        onClick={() => setSidebarOpen(true)}>
                    <span className="sr-only">Open sidebar</span>
                    <Bars3Icon className="h-6 w-6" aria-hidden="true"/>
                </button>
                <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">Dashboard</div>
                <a href="#">
                    <span className="sr-only">Your profile</span>
                    <img
                        className="h-8 w-8 rounded-full bg-gray-50"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                    />
                </a>
            </div>

        </>
    )
}