import {
    AccountSettingsCards,
    DeleteAccountCard,
    ChangePasswordCard,
    ChangeEmailCard
} from "@daveyplate/better-auth-ui"

export default function SettingsPage() {
    return (
        <div className="
      min-h-screen w-full
      flex flex-col items-center
     
      py-14 px-4
    ">
            {/* Page Header */}
            <div className="max-w-xl w-full mb-8 text-center">
                <h1 className="text-2xl font-semibold text-white">
                    Account Settings
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                    Manage your account details and security preferences
                </p>
            </div>

            {/* Settings Cards */}
            <div className="w-full max-w-xl space-y-6">
                <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-4">
                    <AccountSettingsCards />
                </div>

                <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-4">
                    <ChangeEmailCard />
                </div>

                <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-4">
                    <ChangePasswordCard />
                </div>

                <div className="rounded-2xl bg-red-500/10 backdrop-blur-md border border-red-500/30 p-4">
                    <DeleteAccountCard />
                </div>
            </div>
        </div>
    )
}
