import { ReactNode, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { MdClose } from 'react-icons/md'

/** Open modals, oldest first: Escape closes only the one on top. */
const stack: number[] = []
let nextId = 1

interface Props {
  title?: ReactNode
  onClose?: () => void
  children: ReactNode
  /** Tailwind width class of the panel. */
  width?: string
  /** Transaction progress sits above every other modal. */
  priority?: boolean
}

/**
 * Every dialog of the app. Rendered in document.body, so no parent with a transform, filter or
 * overflow can trap or cover it; centered, scrollable when taller than the window.
 */
export function Modal({
  title,
  onClose,
  children,
  width = 'w-[500px]',
  priority
}: Props): JSX.Element {
  const id = useRef(nextId++).current
  const close = useRef(onClose)
  close.current = onClose

  useEffect(() => {
    stack.push(id)
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && stack[stack.length - 1] === id) close.current?.()
    }
    window.addEventListener('keydown', onKey)
    return (): void => {
      window.removeEventListener('keydown', onKey)
      stack.splice(stack.indexOf(id), 1)
    }
  }, [id])

  return createPortal(
    <div
      data-modal-root
      className={`fixed inset-0 ${priority ? 'z-[1100]' : 'z-[1000]'} flex items-center justify-center p-6 bg-black/70`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close.current?.()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`${width} max-w-full max-h-[calc(100vh-48px)] flex flex-col rounded-2xl bg-card-primary border border-green-primary/30 shadow-2xl`}
      >
        {(title || onClose) && (
          <div className="flex items-center justify-between gap-4 px-6 pt-5 pb-3 shrink-0">
            <div className="text-white text-lg font-bold">{title}</div>
            {onClose && (
              <button
                className="p-1 text-gray-300 hover:text-white hover:cursor-pointer"
                onClick={onClose}
              >
                <MdClose size={22} />
              </button>
            )}
          </div>
        )}
        <div className={`px-6 pb-6 overflow-y-auto ${title || onClose ? '' : 'pt-6'}`}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
