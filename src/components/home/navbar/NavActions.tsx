
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
      <div className="flex items-center gap-4">
        <NotificationCenter />
        <ProfileDropdown />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link to="/auth?mode=signin">
        <CRDButton
          variant="ghost"
          size="sm"
        >
          Sign In
        </CRDButton>
      </Link>
      <Link to="/auth?mode=signup">
        <CRDButton
          variant="primary"
          size="sm"
          className="bg-crd-green hover:bg-crd-green/90 font-semibold"
        >
          Sign Up Free
        </CRDButton>
      </Link>
    </div>
  );
};
