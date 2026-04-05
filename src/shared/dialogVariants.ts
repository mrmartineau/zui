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
		position: {
			center: '',
			central: 'zui-dialog-position-central',
			left: 'zui-dialog-position-left',
			right: 'zui-dialog-position-right',
			top: 'zui-dialog-position-top',
			bottom: 'zui-dialog-position-bottom',
		},
	},
	defaultVariants: {
		size: 'md',
	},
})
