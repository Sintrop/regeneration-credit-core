import { useEffect, useState } from 'react'
import { Header } from '@renderer/components/Header/Header'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { LatestTransactions } from './components/LatestTransactions/LatestTransactions'
import { LatestTokensTxs } from './components/LatestTokensTxs/LatestTokensTxs'
import { Stats } from './components/Stats/Stats'

export function HomePage(): JSX.Element {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <>
      <Header />

      <main className="bg-gradient-to-b from-[#043832] to-[#1F5D38] flex flex-col w-screen h-screen py-24 overflow-y-auto">
        <div className="container mx-auto flex">
          <div className="flex gap-10 w-full">
            <div className="w-[600px] h-screen bg-red-500 flex flex-col">

            </div>

            <div className="w-full flex flex-col gap-10">
              <section className="w-full p-3">
                <Stats />
              </section>

              <section className="w-full p-3">
                <LatestTransactions />
              </section>

              <section className="w-full p-3">
                <LatestTokensTxs />
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
