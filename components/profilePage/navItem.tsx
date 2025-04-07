import React from "react";

const NavItem = ({
  icon,
  label,
  active,
  onClick,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  className?: string;
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-3 py-2 space-x-3 rounded-md transition-colors ${
        active
          ? "bg-green-100 text-green-900 dark:bg-green-900/50 dark:text-green-50"
          : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      } ${className}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export default NavItem;
