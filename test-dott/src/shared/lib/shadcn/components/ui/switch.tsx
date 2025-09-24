import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'

import { cn } from 'src/shared/lib/shadcn/lib/utils.ts'

interface SwitchProps
    extends React.ComponentProps<typeof SwitchPrimitive.Root> {
    buttonIcon?: React.ReactNode
}

function Switch({ className, buttonIcon, ...props }: SwitchProps) {
    return (
        <SwitchPrimitive.Root
            data-slot="switch"
            className={cn(
                'peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.7rem] w-12 shrink-0 cursor-pointer items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
                className,
            )}
            {...props}
        >
            <SwitchPrimitive.Thumb
                data-slot="switch-thumb"
                className={cn(
                    'bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-6 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0',
                )}
            >
                <div
                    className={'flex h-full w-full items-center justify-center'}
                >
                    {buttonIcon}
                </div>
            </SwitchPrimitive.Thumb>
        </SwitchPrimitive.Root>
    )
}

export { Switch }
