import React from "react";
import { AdminProtection } from "@/components/AdminProtection";

export const withAdminAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const WithAdminAuthComponent = (props: P) => {
    return (
      <AdminProtection>
        <WrappedComponent {...props} />
      </AdminProtection>
    );
  };

  WithAdminAuthComponent.displayName = `withAdminAuth(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return WithAdminAuthComponent;
};
