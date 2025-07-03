
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { CRDButton } from "@/components/ui/design-system";
import { ProfileDropdown } from "./ProfileDropdown";
import { NotificationCenter } from "@/components/common/NotificationCenter";

export const NavActions = () => {
  const { user } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-3 ml-auto">
        <NotificationCenter />
        <ProfileDropdown />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 ml-auto">
      <Link to="/auth">
        <button className="cta-themed px-4 py-2 rounded-md text-sm font-medium">
          Sign In
        </button>
      </Link>
    </div>
  );
};
