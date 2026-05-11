import { Settings } from 'lucide-react'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from 'src/shared/lib/shadcn/components/ui/drawer.tsx'
import { Button } from 'src/shared/lib/shadcn/components/ui/button.tsx'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from 'src/shared/lib/shadcn/components/ui/tabs'
import SSdarkmodeSwitch from 'src/shared/components/theme/SSdarkmodeSwitch.tsx'
import ColorPicker from 'src/shared/components/theme/SScolorPicker.tsx'
import { useEffect } from 'react'
import {
    applyThemeVariables,
    handleReset,
    saveThemeVar,
    useTheme,
} from 'src/shared/utils/themeUtils.tsx'
import { ScrollArea } from 'src/shared/lib/shadcn/components/ui/scroll-area.tsx'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from 'src/shared/lib/shadcn/components/ui/accordion.tsx'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/app/store/redux/reduxStore.tsx'
import { themeAction } from 'src/shared/components/theme/themeReducer.tsx'
import { colorGroups } from 'src/shared/components/theme/colorConstants.tsx'
import { useAppDispatch } from 'src/app/store/redux/reduxHooks.tsx'

const SScolorDrawer = () => {
    const { theme } = useTheme()

    return (
        <Drawer direction={'right'}>
            <DrawerTrigger asChild>
                <Settings className="h-5 w-5 cursor-pointer" />
            </DrawerTrigger>

            <DrawerContent className="flex flex-col">
                <DrawerHeader>
                    <DrawerTitle
                        className={
                            'flex items-center justify-between border-b pb-4'
                        }
                    >
                        <p>Chose Your Own colors </p> <SSdarkmodeSwitch />
                    </DrawerTitle>
                    <DrawerDescription></DrawerDescription>
                </DrawerHeader>
                <Tabs defaultValue="colors" className="flex-1 px-4">
                    <TabsList>
                        <TabsTrigger value="colors">colors</TabsTrigger>
                        <TabsTrigger value="etc">etc</TabsTrigger>
                    </TabsList>

                    <ScrollArea
                        className={'h-[calc(100dvh-83px-36px-112px)] pr-4'}
                    >
                        <TabsContent value="colors">
                            <ColorPickers />
                        </TabsContent>
                        <TabsContent value="etc">
                            Change your password here.
                        </TabsContent>
                    </ScrollArea>
                </Tabs>

                <DrawerFooter>
                    <Button onClick={() => handleReset(theme)}> Reset</Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default SScolorDrawer

const ColorPickers = () => {
    const { theme } = useTheme()
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(themeAction.setColors({}))
    }, [theme, dispatch])

    const { colors } = useSelector(
        (state: RootState) => ({
            colors: state.themeReducer.colors,
        }),
        shallowEqual,
    )

    const handleColorChange = (key: string) => (color: string) => {
        saveThemeVar(theme, key, color)
        applyThemeVariables(theme)
    }

    return (
        <Accordion type="multiple" className="w-full">
            {colorGroups.map((group, idx) => (
                <AccordionItem key={group.label} value={`group-${idx}`}>
                    <AccordionTrigger>{group.label}</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4">
                            {group.keys.map((key) => (
                                <ColorPicker
                                    key={key}
                                    variableKey={key}
                                    color={colors[key]}
                                    label={key
                                        .replace('--', '')
                                        .replace(/-/g, ' ')
                                        .toLowerCase()}
                                    onChange={handleColorChange(key)}
                                />
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    )
}
