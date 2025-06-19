
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { useDebug } from "@/contexts/DebugContext";
import { CRDButton } from "@/components/ui/design-system";
import { ProfileDropdown } from "./ProfileDropdown";
import { NotificationCenter } from "@/components/common/NotificationCenter";
import { Bug } from "lucide-react";

export const NavActions = () => {
  const { user } = useAuth();
  const { isDebugMode, toggleDebugMode } = useDebug();

  const isDevMode = process.env.NODE_ENV === 'development';

  if (user) {
    return (
      <div className="flex items-center gap-3 ml-auto">
        <NotificationCenter />
        {isDevMode && (
          <CRDButton
            variant={isDebugMode ? "primary" : "ghost"}
            size="sm"
            onClick={toggleDebugMode}
            className="px-2"
            title="Toggle Debug Mode"
          >
            <Bug className="w-4 h-4" />
          </CRDButton>
        )}
        <ProfileDropdown />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 ml-auto">
      {isDevMode && (
        <CRDButton
          variant={isDebugMode ? "primary" : "ghost"}
          size="sm"
          onClick={toggleDebugMode}
          className="px-2"
          title="Toggle Debug Mode"
        >
          <Bug className="w-4 h-4" />
        </CRDButton>
      )}
      <Link to="/auth">
        <CRDButton
          variant="outline"
          size="sm"
        >
          Sign In
        </CRDButton>
      </Link>
    </div>
  );
};
