import {Sidebar} from "/src/components/Sidebar.tsx";

export const DashboardLayout = ({children}) => {

    return (
        <>
            <div className="flex h-screen">
                {/* Sidebar */}
                <Sidebar/>

                {/* Main content */}
                <div className="flex-1 p-6 overflow-auto bg-gray-50">{children}</div>
            </div>
        </>
    )

}