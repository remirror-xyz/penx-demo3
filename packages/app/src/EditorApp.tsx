import { FC, PropsWithChildren, useEffect } from 'react'
import { Provider } from 'jotai'
import { CatalogueNodeType, CatalogueTree } from '@penx/catalogue'
import { isServer } from '@penx/constants'
import { Catalogue } from '@penx/domain'
import { emitter } from '@penx/event'
import { appLoader, useLoaderStatus } from '@penx/loader'
import { db } from '@penx/local-db'
import { JotaiNexus, spacesAtom, store } from '@penx/store'
import { ClientOnly } from './components/ClientOnly'
import { EditorLayout } from './EditorLayout/EditorLayout'
import { WorkerStarter } from './WorkerStarter'

if (!isServer) {
  appLoader.init()

  emitter.on('ADD_DOCUMENT', () => {
    const spaces = store.get(spacesAtom)
    const activeSpace = spaces.find((space) => space.isActive)!

    // TODO:
    store.createDoc()
  })
}

export const EditorApp: FC<PropsWithChildren> = ({ children }) => {
  const { isLoaded } = useLoaderStatus()

  useEffect(() => {
    persist()
      .then((d) => {
        //
      })
      .catch((e) => {
        //
      })
  }, [])

  if (!isLoaded) {
    return null
  }

  return (
    <ClientOnly>
      <Provider store={store}>
        <WorkerStarter />
        <JotaiNexus />
        <EditorLayout />
      </Provider>
    </ClientOnly>
  )
}

async function persist() {
  if (navigator.storage && navigator.storage.persist) {
    return navigator.storage.persist()
  }
}
