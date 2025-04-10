import { IconBaseProps } from '@renderer/components/Icon/Icon'

export function DashboardIcon({ color = 'white', size = 20 }: IconBaseProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 29 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.1111 9.66667V0H29V9.66667H16.1111ZM0 16.1111V0H12.8889V16.1111H0ZM16.1111 29V12.8889H29V29H16.1111ZM0 29V19.3333H12.8889V29H0ZM3.22222 12.8889H9.66667V3.22222H3.22222V12.8889ZM19.3333 25.7778H25.7778V16.1111H19.3333V25.7778ZM19.3333 6.44444H25.7778V3.22222H19.3333V6.44444ZM3.22222 25.7778H9.66667V22.5556H3.22222V25.7778Z"
        fill={color}
      />
    </svg>
  )
}
