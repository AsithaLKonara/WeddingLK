"use client"

export function RegistrationProgress() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Registration Progress</h3>
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
          <span className="text-gray-700 dark:text-gray-300">Account Created</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">2</div>
          <span className="text-gray-700 dark:text-gray-300">Profile Setup</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 text-sm">3</div>
          <span className="text-gray-500 dark:text-gray-400">Verification</span>
        </div>
      </div>
    </div>
  )
}
