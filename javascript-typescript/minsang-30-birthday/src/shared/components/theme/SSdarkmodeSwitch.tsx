import React from 'react'
import { Switch } from 'src/shared/lib/shadcn/components/ui/switch.tsx'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'src/shared/utils/themeUtils.tsx'

const SSdarkmodeSwitch = () => {
    const { isDarkTheme, setTheme } = useTheme()

    return (
        <Switch
            checked={isDarkTheme}
            onCheckedChange={() => setTheme(isDarkTheme ? 'light' : 'dark')}
            buttonIcon={
                isDarkTheme ? (
                    <Moon className="text-primary h-4 w-4" />
                ) : (
                    <Sun className="text-foreground h-4 w-4" />
                )
            }
        />
    )
}

export default SSdarkmodeSwitch
