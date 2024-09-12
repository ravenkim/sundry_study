import { Separator } from 'src/assets/shadcn/components/ui/separator'

const SSdivider = ({ text }) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                alignItems: 'center',
            }}
        >
            <div style={{ flex: 1 }}>
                <Separator />
            </div>
            {text && <span style={{ margin: '0 12px' }}>{text}</span>}
            <div style={{ flex: 1 }}>
                <Separator />
            </div>
        </div>
    )
}

export default SSdivider