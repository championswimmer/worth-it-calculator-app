import { cn } from "@/lib/utils";
import React from "react";

interface ErrorTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
    children: React.ReactNode;
}

const ErrorText = React.forwardRef<HTMLParagraphElement, ErrorTextProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <p
                ref={ref}
                className={cn(
                    "text-sm font-medium text-error-light dark:text-error-dark",
                    className
                )}
                {...props}
            >
                {children}
            </p>
        );
    }
);

ErrorText.displayName = "ErrorText";

export { ErrorText };