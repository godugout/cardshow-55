
import React from "react";
import { Link } from "react-router-dom";
import { CRDButton, Typography } from "@/components/ui/design-system";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { useAuth } from "@/features/auth/providers/AuthProvider";

export const Hero: React.FC = () => {
  const { containerPadding, isMobile } = useResponsiveLayout();
  const { user } = useAuth();
  
  return (
    <div className={`items-center bg-crd-darkest flex w-full flex-col overflow-hidden text-center pt-32 ${isMobile ? 'px-5' : 'px-[352px]'} max-md:max-w-full max-md:pt-[100px]`}>
      <div className="flex w-full max-w-[736px] flex-col items-center max-md:max-w-full">
        <div className="flex w-full flex-col items-center">
          <Typography 
            variant="caption" 
            className="text-xs font-semibold leading-none uppercase mb-2"
          >
            THE FIRST PRINT & MINT DIGITAL CARD MARKET
          </Typography>
          <Typography 
            as="h1" 
            variant="h1"
            className="text-[40px] font-black leading-[48px] tracking-[-0.4px] mt-2 max-md:max-w-full text-center"
          >
            Create, collect, and trade
            <br />
            card art and digital collectibles.
          </Typography>
        </div>
        
        {/* Dynamic CTA based on authentication */}
        {user ? (
          <Link to="/cards/create">
            <CRDButton 
              variant="primary"
              size="lg"
              className="self-stretch gap-3 text-lg font-extrabold mt-6 px-6 py-4 rounded-[90px] max-md:px-5"
            >
              Start Creating
            </CRDButton>
          </Link>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link to="/auth?mode=signup">
              <CRDButton 
                variant="primary"
                size="lg"
                className="gap-3 text-lg font-extrabold px-8 py-4 rounded-[90px] max-md:px-5 bg-crd-green hover:bg-crd-green/90"
              >
                Join Free Today
              </CRDButton>
            </Link>
            <Link to="/auth?mode=signin">
              <CRDButton 
                variant="outline"
                size="lg"
                className="gap-3 text-lg font-semibold px-8 py-4 rounded-[90px] max-md:px-5"
              >
                Sign In
              </CRDButton>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
