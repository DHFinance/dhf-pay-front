import React from 'react'

export default interface SvgInterface
    extends React.HTMLAttributes<HTMLDivElement> {
    width?: number
    height?: number
    color?: string
    onClick?: (e: React.MouseEvent) => void
    blackenOnHover?: boolean
}
