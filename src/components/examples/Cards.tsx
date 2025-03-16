import { cn } from "@/lib/utils"

import { DemoCookieSettings } from "./cards/cookie-settings"
import { DemoCreateAccount } from "./cards/create-account"
import { DemoDatePicker } from "./cards/date-picker"
import { DemoGithub } from "./cards/github-card"
import { DemoNotifications } from "./cards/notifications"
import { DemoPaymentMethod } from "./cards/payment-method"
import { DemoReportAnIssue } from "./cards/report-an-issue"
import { DemoShareDocument } from "./cards/share-document"
import { DemoTeamMembers } from "./cards/team-members"
import { useEffect } from "react"

export function DemoContainer({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				"flex items-center justify-center [&>div]:w-full",
				className
			)}
			{...props}
		/>
	)
}

export function DemoCards() {
	return (
		<>
			<div className="items-start justify-center gap-1 rounded-lg grid grid-cols-1">
				<div className="grid items-start gap-2">
					<DemoContainer>
						<DemoCreateAccount />
					</DemoContainer>
					<DemoContainer>
						<DemoPaymentMethod />
					</DemoContainer>
				</div>
				<div className="grid items-start gap-2">
					<DemoContainer>
						<DemoTeamMembers />
					</DemoContainer>
					<DemoContainer>
						<DemoShareDocument />
					</DemoContainer>
					<DemoContainer>
						<DemoDatePicker />
					</DemoContainer>
					<DemoContainer>
						<DemoNotifications />
					</DemoContainer>
				</div>
				<div className="grid items-start gap-2">
					<DemoContainer>
						<DemoReportAnIssue />
					</DemoContainer>
					<DemoContainer>
						<DemoGithub />
					</DemoContainer>
					<DemoContainer>
						<DemoCookieSettings />
					</DemoContainer>
				</div>
			</div>
		</>
	)
}
