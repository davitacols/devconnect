import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface TagPageProps {
  params: {
    slug: string
  }
}

async function getTag(slug: string) {
  return db.tag.findUnique({
    where: { slug },
    include: {
      posts: {
        where: { published: true },
        include: {
          author: true,
          tags: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  })
}

export async function generateMetadata({ params }: TagPageProps) {
  const tag = await getTag(params.slug)

  if (!tag) {
    return {
      title: "Tag Not Found",
      description: "The tag you are looking for does not exist",
    }
  }

  return {
    title: `${tag.name} Articles`,
    description: `Browse all articles related to ${tag.name}`,
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const tag = await getTag(params.slug)

  if (!tag) {
    notFound()
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">{tag.name}</h1>
        <p className="text-muted-foreground max-w-2xl">Browse all articles related to {tag.name}</p>
        <Separator className="mt-6" />
      </div>

      {tag.posts.length === 0 ? (
        <div className="text-center py-10">
          <h2 className="text-xl font-medium mb-2">No articles found</h2>
          <p className="text-muted-foreground">There are no articles with this tag yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tag.posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={post.bannerImage || "/placeholder.svg?height=300&width=500"}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex gap-2 mb-2">
                  {post.tags.slice(0, 2).map((postTag) => (
                    <Link
                      key={postTag.id}
                      href={`/tag/${postTag.slug}`}
                      className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full hover:bg-secondary/80"
                    >
                      {postTag.name}
                    </Link>
                  ))}
                </div>
                <h2 className="text-xl font-bold mb-2 line-clamp-2">
                  <Link href={`/article/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-muted-foreground line-clamp-2">{post.description}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <div className="flex items-center gap-2">
                  <Image
                    src={post.author.image || "/placeholder.svg?height=24&width=24"}
                    alt={post.author.name || "Author"}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span className="text-xs">{post.author.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</span>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

