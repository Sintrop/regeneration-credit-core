import { useNavigate } from 'react-router-dom'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'

export function NavBtns(): JSX.Element {
  const navigate = useNavigate()

  function handleNavigation(type: '-' | '+'): void {
    if (type === '-') navigate(-1)
    if (type === '+') navigate(+1)
  }

  return (
    <div className="flex rounded-2xl bg-green-900 w-20 h-8 overflow-hidden">
      <button
        className="hover:cursor-pointer hover:bg-green-950 duration-300 border-r border-green-950 flex flex-1 items-center justify-center"
        onClick={() => handleNavigation('-')}
      >
        <MdKeyboardArrowLeft color="white" size={23} />
      </button>

      <button
        className="hover:cursor-pointer hover:bg-green-950 duration-300 flex flex-1 items-center justify-center"
        onClick={() => handleNavigation('+')}
      >
        <MdKeyboardArrowRight color="white" size={23} />
      </button>
    </div>
  )
}
