import { Box } from '@fower/react'
import { PropsWithChildren, useEffect, useState } from 'react'
import { Descendant } from 'slate'

import { ELEMENT_LI, ELEMENT_LIC, ELEMENT_P, ELEMENT_UL } from '@penx/constants'
import { QuickInputEditor } from '@penx/editor'
import { PenxEditor } from '@penx/editor-common'
import { genId } from '@penx/editor-shared'
import { useExtensionStore } from '@penx/hooks'
import { StoreProvider } from '@penx/store'

import { extensionList } from './extensionList'
import { penx } from './penx'

function getDefaultContent() {
  const content = [
    {
      type: ELEMENT_UL,
      children: [
        {
          type: ELEMENT_LI,
          children: [
            {
              id: genId(),
              type: ELEMENT_LIC,
              children: [
                {
                  type: 'p',
                  children: [{ text: '' }],
                },
              ],
            },
          ],
        },
      ],
    },
  ]
  return content
}

interface Props {
  onChange?: (value: Descendant[], editor: PenxEditor) => void
}

export const ContentEditor = ({ onChange }: Props) => {
  return (
    <StoreProvider>
      <ExtensionLoader>
        <QuickInputEditor
          plugins={[]}
          content={getDefaultContent()}
          onChange={onChange}
        />
      </ExtensionLoader>
    </StoreProvider>
  )
}

function ExtensionLoader({ children }: PropsWithChildren) {
  const { extensionStore } = useExtensionStore()
  useEffect(() => {
    for (const item of extensionList) {
      const ctx = Object.create(penx, {
        pluginId: {
          writable: false,
          configurable: false,
          value: item.id,
        },
      })
      item.activate(ctx)
    }
  }, [])

  if (!extensionStore.withFns.length) return null

  return <>{children}</>
}