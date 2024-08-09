import LoadingDots from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import { postAtom } from '@/hooks/usePost'
import { postsAtom } from '@/hooks/usePosts'
import { useSpaces } from '@/hooks/useSpaces'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { api, trpc } from '@/lib/trpc'
import { store } from '@/store'
import { Feather, PencilLine } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function CreatePostButton() {
  const { space } = useSpaces()
  const { push } = useRouter()
  const { isPending, mutateAsync } = trpc.post.create.useMutation()
  return (
    <Button
      size="icon"
      variant="default"
      className="rounded-full h-9 w-9"
      onClick={async () => {
        try {
          const post = await mutateAsync({ spaceId: space.id })
          store.set(postAtom, post as any)
          setTimeout(async () => {
            const posts = await api.post.listBySpaceId.query(space.id)
            store.set(postsAtom, posts)
          }, 0)
          push(`/~/post/${post.id}`)
        } catch (error) {
          const msg = extractErrorMessage(error)
          toast.error(msg || 'Failed to create post')
        }
      }}
    >
      {isPending ? (
        <LoadingDots color="white" />
      ) : (
        <div className="flex gap-1">
          <Feather size={14}></Feather>
        </div>
      )}
    </Button>
  )
}
