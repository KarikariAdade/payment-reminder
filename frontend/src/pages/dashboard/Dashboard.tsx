import {DashboardLayout} from "/src/components/DashboardLayout.tsx";

export const Dashboard = () => {
    return (
        <>
            <DashboardLayout>
                <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
                <p>This is your main content area.</p>
            </DashboardLayout>
        </>
    )
}