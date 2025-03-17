import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

export function DemoPaymentMethod() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Payment Method</CardTitle>
				<CardDescription>Add a new payment method to your account.</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-6">
				<ToggleGroup type="single" className="grid grid-cols-3 w-full gap-4">
					<ToggleGroupItem
						value="Card"
						aria-label="Card"
						className="flex flex-col items-center h-fit justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground focus:border-primary"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							className="mb-3 size-6"
						>
							<rect width="20" height="14" x="2" y="5" rx="2" />
							<path d="M2 10h20" />
						</svg>
						Card
					</ToggleGroupItem>
					<ToggleGroupItem
						value="Paypal"
						aria-label="Paypal"
						className="flex flex-col items-center h-fit justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground focus:border-primary"
					>
						<Icons.paypal className="mb-3 size-6" />
						Paypal
					</ToggleGroupItem>
					<ToggleGroupItem
						value="Apple"
						aria-label="Apple"
						className="flex flex-col items-center h-fit justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground focus:border-primary"
					>
						<Icons.apple className="mb-3 size-6" />
						Apple
					</ToggleGroupItem>
				</ToggleGroup>

				<div className="grid gap-2">
					<Label htmlFor="name">Name</Label>
					<Input id="name" placeholder="First Last" />
				</div>
				<div className="grid gap-2">
					<Label htmlFor="number">Card number</Label>
					<Input id="number" placeholder="" />
				</div>
				<div className="grid grid-cols-3 gap-4">
					<div className="grid gap-2">
						<Label htmlFor="month">Expires</Label>
						<Select>
							<SelectTrigger id="month">
								<SelectValue placeholder="Month" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="1">January</SelectItem>
								<SelectItem value="2">February</SelectItem>
								<SelectItem value="3">March</SelectItem>
								<SelectItem value="4">April</SelectItem>
								<SelectItem value="5">May</SelectItem>
								<SelectItem value="6">June</SelectItem>
								<SelectItem value="7">July</SelectItem>
								<SelectItem value="8">August</SelectItem>
								<SelectItem value="9">September</SelectItem>
								<SelectItem value="10">October</SelectItem>
								<SelectItem value="11">November</SelectItem>
								<SelectItem value="12">December</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="year">Year</Label>
						<Select>
							<SelectTrigger id="year">
								<SelectValue placeholder="Year" />
							</SelectTrigger>
							<SelectContent>
								{Array.from({ length: 10 }, (_, i) => (
									<SelectItem key={i} value={`${new Date().getFullYear() + i}`}>
										{new Date().getFullYear() + i}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="cvc">CVC</Label>
						<Input id="cvc" placeholder="CVC" />
					</div>
				</div>
			</CardContent>
			<CardFooter>
				<Button className="w-full">Continue</Button>
			</CardFooter>
		</Card>
	)
}
