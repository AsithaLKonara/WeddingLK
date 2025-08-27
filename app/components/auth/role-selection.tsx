"use client"

interface RoleSelectionProps {
  onRoleSelect: (role: string) => void;
}

export function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Select Your Role</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          onClick={() => onRoleSelect('bride-groom')}
          className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="text-2xl mb-2">👰</div>
          <div className="font-medium">Bride/Groom</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Planning your wedding</div>
        </button>
        <button 
          onClick={() => onRoleSelect('vendor')}
          className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="text-2xl mb-2">🏢</div>
          <div className="font-medium">Vendor</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Providing services</div>
        </button>
        <button 
          onClick={() => onRoleSelect('planner')}
          className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="text-2xl mb-2">📋</div>
          <div className="font-medium">Planner</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Coordinating events</div>
        </button>
      </div>
    </div>
  )
}
