import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'

interface Props {
  totalPages: number
  atualPage: number
  onChange: (page: number) => void
}
export function PageSelect({ atualPage, onChange, totalPages }: Props): JSX.Element {
  function previousPage(): void {
    if (atualPage <= 1) {
      return
    }

    onChange(atualPage - 1)
  }

  function nextPage(): void {
    if (atualPage >= totalPages) {
      return
    }

    onChange(atualPage + 1)
  }

  return (
    <div className="flex flex-row items-center rounded-md bg-container-primary w-fit overflow-hidden">
      <button className="w-8 h-8 flex items-center justify-center" onClick={previousPage}>
        <BiChevronLeft size={20} color="white" />
      </button>
      <div className="justify-center px-3 bg-container-secondary h-full items-center flex">
        <p className="text-white text-sm">
          {atualPage} de {totalPages}
        </p>
      </div>
      <button className="w-8 h-8 items-center justify-center flex" onClick={nextPage}>
        <BiChevronRight size={20} color="white" />
      </button>
    </div>
  )
}
