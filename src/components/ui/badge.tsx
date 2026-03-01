import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "destructive" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
    // Map variants to CSS classes
    const variantClass = `badge badge-${variant}`;

    return (
        <div className={`${variantClass} ${className || ""}`} {...props} />
    );
}
