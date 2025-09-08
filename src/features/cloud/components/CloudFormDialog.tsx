'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/shared/lib/shadcn/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/lib/shadcn/components/ui/dialog'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shared/lib/shadcn/components/ui/form'
import { Input } from '@/shared/lib/shadcn/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/lib/shadcn/components/ui/select'
import {
    AWSCredential,
    AWSCredentialType,
    AWSEventSource,
    Cloud,
} from '@/features/cloud/types'
import { useEffect, useState } from 'react'
import { Switch } from '@/shared/lib/shadcn/components/ui/switch'
import { Textarea } from '@/shared/lib/shadcn/components/ui/textarea'
import { ScrollArea } from '@/shared/lib/shadcn/components/ui/scroll-area'
import { fetchCloudDetail } from '../cloudAPI'
import SSspin from '@/shared/components/loading/SSspin'
import { Separator } from '@/shared/lib/shadcn/components/ui/separator'

const formSchema = z
    .object({
        name: z.string().min(1, 'Name is required'),
        provider: z.enum(['AWS', 'AZURE', 'GCP']),
        cloudGroupName: z.string().optional(),
        regionList: z.string().min(1, 'At least one region is required'),
        proxyUrl: z
            .string()
            .url({ message: 'Invalid URL' })
            .optional()
            .or(z.literal('')),
        credentialType: z.enum(['ACCESS_KEY', 'ASSUME_ROLE', 'ROLES_ANYWHERE']),
        accessKeyId: z.string().min(1, 'Access Key ID is required'),
        secretAccessKey: z.string().optional(),
        cloudTrailName: z.string().optional(),
        eventProcessEnabled: z.boolean().default(false),
        userActivityEnabled: z.boolean().default(false),
        scheduleScanEnabled: z.boolean().default(false),
        scheduleScanSetting: z
            .object({
                frequency: z.enum(['HOUR', 'DAY', 'WEEK', 'MONTH']),
                date: z.string().optional(),
                weekday: z
                    .enum(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'])
                    .optional(),
                hour: z.string().optional(),
                minute: z.string().optional(),
            })
            .optional(),
    })
    .superRefine((data, ctx) => {
        if (data.scheduleScanEnabled && data.scheduleScanSetting) {
            const setting = data.scheduleScanSetting
            if (setting.frequency === 'WEEK' && !setting.weekday) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Day of the week is required for weekly scans.',
                    path: ['scheduleScanSetting', 'weekday'],
                })
            }
            if (setting.frequency === 'MONTH' && !setting.date) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Day of the month is required for monthly scans.',
                    path: ['scheduleScanSetting', 'date'],
                })
            }
            if (
                ['DAY', 'WEEK', 'MONTH'].includes(setting.frequency) &&
                !setting.hour
            ) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Hour is required for this frequency.',
                    path: ['scheduleScanSetting', 'hour'],
                })
            }
            if (
                ['DAY', 'WEEK', 'MONTH'].includes(setting.frequency) &&
                !setting.minute
            ) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Minute is required for this frequency.',
                    path: ['scheduleScanSetting', 'minute'],
                })
            }
        }
    })

export type FormValues = z.infer<typeof formSchema>

interface CloudFormDialogProps {
    mode: 'create' | 'edit'
    cloud?: Cloud
    isOpen: boolean
    onClose: () => void
    onSave: (data: Partial<FormValues>) => void
}

export function CloudFormDialog({
    mode,
    cloud,
    isOpen,
    onClose,
    onSave,
}: CloudFormDialogProps) {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            provider: 'AWS',
            cloudGroupName: '',
            regionList: '',
            proxyUrl: '',
            credentialType: 'ACCESS_KEY',
            accessKeyId: '',
            secretAccessKey: '',
            cloudTrailName: '',
            eventProcessEnabled: false,
            userActivityEnabled: false,
            scheduleScanEnabled: false,
        },
    })

    useEffect(() => {
        const loadData = async () => {
            if (isOpen && mode === 'edit' && cloud?.id) {
                setIsLoading(true)
                try {
                    const detailedCloud = await fetchCloudDetail(cloud.id)

                    let accessKeyId = ''
                    if (
                        detailedCloud.provider === 'AWS' &&
                        'accessKeyId' in detailedCloud.credentials
                    ) {
                        accessKeyId = (
                            detailedCloud.credentials as AWSCredential
                        ).accessKeyId
                    }

                    let cloudTrailName = ''
                    if (
                        detailedCloud.provider === 'AWS' &&
                        detailedCloud.eventSource &&
                        'cloudTrailName' in detailedCloud.eventSource
                    ) {
                        cloudTrailName =
                            (detailedCloud.eventSource as AWSEventSource)
                                .cloudTrailName || ''
                    }

                    form.reset({
                        name: detailedCloud.name,
                        provider: detailedCloud.provider,
                        cloudGroupName:
                            detailedCloud.cloudGroupName?.join(', ') || '',
                        regionList: detailedCloud.regionList.join(', '),
                        proxyUrl: detailedCloud.proxyUrl || '',
                        eventProcessEnabled: detailedCloud.eventProcessEnabled,
                        userActivityEnabled: detailedCloud.userActivityEnabled,
                        scheduleScanEnabled: detailedCloud.scheduleScanEnabled,
                        scheduleScanSetting: detailedCloud.scheduleScanSetting,
                        credentialType:
                            detailedCloud.credentialType as AWSCredentialType,
                        accessKeyId: accessKeyId,
                        secretAccessKey: '************',
                        cloudTrailName: cloudTrailName,
                    })
                } catch (error) {
                    console.error('Failed to fetch cloud details', error)
                    onClose()
                } finally {
                    setIsLoading(false)
                }
            } else if (isOpen && mode === 'create') {
                form.reset(form.formState.defaultValues)
            }
        }
        loadData()
    }, [cloud, mode, isOpen, form, onClose])

    const onSubmit = (data: FormValues) => {
        const submissionData: Partial<FormValues> = { ...data }
        if (mode === 'edit' && data.secretAccessKey === '************') {
            delete submissionData.secretAccessKey
        }
        if (!data.scheduleScanEnabled) {
            delete submissionData.scheduleScanSetting
        }
        console.log('Data to be sent to API:', submissionData)
        onSave(submissionData)
        onClose()
    }

    const scheduleScanEnabled = form.watch('scheduleScanEnabled')
    const scheduleFrequency = form.watch('scheduleScanSetting.frequency')

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'create' ? 'Create Cloud' : 'Edit Cloud'}
                    </DialogTitle>
                    <DialogDescription>
                        Make changes to your cloud connection here. Click save
                        when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <SSspin loading={isLoading} text="Loading...">
                    <ScrollArea className="h-[70vh] p-4">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-8"
                            >
                                {!isLoading && (
                                    <>
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-medium">
                                                General
                                            </h3>
                                            <div className="grid grid-cols-1 gap-6">
                                                <FormField
                                                    control={form.control}
                                                    name="name"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Name
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="My AWS Connection"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="provider"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Provider
                                                            </FormLabel>
                                                            <Select
                                                                onValueChange={
                                                                    field.onChange
                                                                }
                                                                defaultValue={
                                                                    field.value
                                                                }
                                                            >
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select a provider" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="AWS">
                                                                        AWS
                                                                    </SelectItem>
                                                                    <SelectItem
                                                                        value="AZURE"
                                                                        disabled
                                                                    >
                                                                        Azure
                                                                        (soon)
                                                                    </SelectItem>
                                                                    <SelectItem
                                                                        value="GCP"
                                                                        disabled
                                                                    >
                                                                        GCP
                                                                        (soon)
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="space-y-6">
                                            <h3 className="text-lg font-medium">
                                                Credentials
                                            </h3>
                                            <div className="grid grid-cols-1 gap-6">
                                                <FormField
                                                    control={form.control}
                                                    name="credentialType"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Credential Type
                                                            </FormLabel>
                                                            <Select
                                                                onValueChange={
                                                                    field.onChange
                                                                }
                                                                defaultValue={
                                                                    field.value
                                                                }
                                                            >
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select a credential type" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="ACCESS_KEY">
                                                                        Access
                                                                        Key
                                                                    </SelectItem>
                                                                    <SelectItem
                                                                        value="ASSUME_ROLE"
                                                                        disabled
                                                                    >
                                                                        Assume
                                                                        Role
                                                                        (soon)
                                                                    </SelectItem>
                                                                    <SelectItem
                                                                        value="ROLES_ANYWHERE"
                                                                        disabled
                                                                    >
                                                                        Roles
                                                                        Anywhere
                                                                        (soon)
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="accessKeyId"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Access Key ID
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="AKIA..."
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="secretAccessKey"
                                                    render={({ field }) => (
                                                        <FormItem className="md:col-span-2">
                                                            <FormLabel>
                                                                Secret Access
                                                                Key
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="password"
                                                                    placeholder={
                                                                        mode ===
                                                                        'edit'
                                                                            ? 'Leave blank to keep unchanged'
                                                                            : ''
                                                                    }
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="space-y-6">
                                            <h3 className="text-lg font-medium">
                                                Configuration
                                            </h3>
                                            <div className=" gap-6">
                                                <FormField
                                                    control={form.control}
                                                    name="regionList"
                                                    render={({ field }) => (
                                                        <FormItem className="md:col-span-2">
                                                            <FormLabel>
                                                                Region List
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    placeholder="ap-northeast-2, us-east-1"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Comma-separated
                                                                list of regions.
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}

                                                    name="cloudGroupName"
                                                    render={({ field }) => (
                                                        <FormItem
                                                            className={'my-6 '}
                                                        >
                                                            <FormLabel>
                                                                Cloud Group Name
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="default, finance"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Comma-separated
                                                                list of group
                                                                names.
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="proxyUrl"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Proxy URL
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="http://proxy.example.com:8080"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="space-y-6">
                                            <h3 className="text-lg font-medium">
                                                Events & Scanning
                                            </h3>
                                            <div className="grid grid-cols-1 gap-6">
                                                <FormField
                                                    control={form.control}
                                                    name="cloudTrailName"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                CloudTrail Name
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="main-trail"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <div />
                                                <FormField
                                                    control={form.control}
                                                    name="eventProcessEnabled"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                                            <div className="space-y-0.5">
                                                                <FormLabel>
                                                                    Enable Event
                                                                    Processing
                                                                </FormLabel>
                                                            </div>
                                                            <FormControl>
                                                                <Switch
                                                                    checked={
                                                                        field.value
                                                                    }
                                                                    onCheckedChange={
                                                                        field.onChange
                                                                    }
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="userActivityEnabled"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                                            <div className="space-y-0.5">
                                                                <FormLabel>
                                                                    Enable User
                                                                    Activity
                                                                </FormLabel>
                                                            </div>
                                                            <FormControl>
                                                                <Switch
                                                                    checked={
                                                                        field.value
                                                                    }
                                                                    onCheckedChange={
                                                                        field.onChange
                                                                    }
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="scheduleScanEnabled"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm md:col-span-2">
                                                            <div className="space-y-0.5">
                                                                <FormLabel>
                                                                    Enable
                                                                    Schedule
                                                                    Scan
                                                                </FormLabel>
                                                            </div>
                                                            <FormControl>
                                                                <Switch
                                                                    checked={
                                                                        field.value
                                                                    }
                                                                    onCheckedChange={
                                                                        field.onChange
                                                                    }
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            {scheduleScanEnabled && (
                                                <div className="mt-4 space-y-6 rounded-lg border p-4">
                                                    <h4 className="text-md font-medium">
                                                        Schedule Scan Settings
                                                    </h4>
                                                    <div className="grid grid-cols-1 gap-6">
                                                        <FormField
                                                            control={
                                                                form.control
                                                            }
                                                            name="scheduleScanSetting.frequency"
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormItem>
                                                                    <FormLabel>
                                                                        Frequency
                                                                    </FormLabel>
                                                                    <Select
                                                                        onValueChange={
                                                                            field.onChange
                                                                        }
                                                                        defaultValue={
                                                                            field.value
                                                                        }
                                                                    >
                                                                        <FormControl>
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder="Select frequency" />
                                                                            </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent>
                                                                            <SelectItem value="HOUR">
                                                                                Hourly
                                                                            </SelectItem>
                                                                            <SelectItem value="DAY">
                                                                                Daily
                                                                            </SelectItem>
                                                                            <SelectItem value="WEEK">
                                                                                Weekly
                                                                            </SelectItem>
                                                                            <SelectItem value="MONTH">
                                                                                Monthly
                                                                            </SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        {scheduleFrequency ===
                                                            'WEEK' && (
                                                            <FormField
                                                                control={
                                                                    form.control
                                                                }
                                                                name="scheduleScanSetting.weekday"
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <FormItem>
                                                                        <FormLabel>
                                                                            Day
                                                                            of
                                                                            Week
                                                                        </FormLabel>
                                                                        <Select
                                                                            onValueChange={
                                                                                field.onChange
                                                                            }
                                                                            defaultValue={
                                                                                field.value
                                                                            }
                                                                        >
                                                                            <FormControl>
                                                                                <SelectTrigger>
                                                                                    <SelectValue placeholder="Select a day" />
                                                                                </SelectTrigger>
                                                                            </FormControl>
                                                                            <SelectContent>
                                                                                <SelectItem value="MON">
                                                                                    Monday
                                                                                </SelectItem>
                                                                                <SelectItem value="TUE">
                                                                                    Tuesday
                                                                                </SelectItem>
                                                                                <SelectItem value="WED">
                                                                                    Wednesday
                                                                                </SelectItem>
                                                                                <SelectItem value="THU">
                                                                                    Thursday
                                                                                </SelectItem>
                                                                                <SelectItem value="FRI">
                                                                                    Friday
                                                                                </SelectItem>
                                                                                <SelectItem value="SAT">
                                                                                    Saturday
                                                                                </SelectItem>
                                                                                <SelectItem value="SUN">
                                                                                    Sunday
                                                                                </SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        )}
                                                        {scheduleFrequency ===
                                                            'MONTH' && (
                                                            <FormField
                                                                control={
                                                                    form.control
                                                                }
                                                                name="scheduleScanSetting.date"
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <FormItem>
                                                                        <FormLabel>
                                                                            Day
                                                                            of
                                                                            Month
                                                                        </FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="number"
                                                                                min={
                                                                                    1
                                                                                }
                                                                                max={
                                                                                    28
                                                                                }
                                                                                {...field}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        )}

                                                        <FormField
                                                            control={
                                                                form.control
                                                            }
                                                            name="scheduleScanSetting.hour"
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormItem>
                                                                    <FormLabel>
                                                                        Hour
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            type="number"
                                                                            min={
                                                                                0
                                                                            }
                                                                            max={
                                                                                23
                                                                            }
                                                                            {...field}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={
                                                                form.control
                                                            }
                                                            name="scheduleScanSetting.minute"
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormItem>
                                                                    <FormLabel>
                                                                        Minute
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            type="number"
                                                                            min={
                                                                                0
                                                                            }
                                                                            max={
                                                                                59
                                                                            }
                                                                            step={
                                                                                5
                                                                            }
                                                                            {...field}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <DialogFooter className="!mt-8">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={onClose}
                                                disabled={isLoading}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={isLoading}
                                            >
                                                Save
                                            </Button>
                                        </DialogFooter>
                                    </>
                                )}
                            </form>
                        </Form>
                    </ScrollArea>
                </SSspin>
            </DialogContent>
        </Dialog>
    )
}
