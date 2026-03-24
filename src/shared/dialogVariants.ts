import { cva } from 'cva'

export const dialogVariants = cva({
	base: 'zui-dialog',
	variants: {
		size: {
			sm: 'zui-dialog-size-sm',
			md: '',
			lg: 'zui-dialog-size-lg',
			full: 'zui-dialog-size-full',
		},
	},
	defaultVariants: {
		size: 'md',
	},
})
