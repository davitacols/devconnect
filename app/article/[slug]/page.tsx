import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import CommentSection from "@/components/comment-section"

interface ArticlePageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Article Not Found",
      description: "The article you are looking for does not exist",
    }
  }

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author.name || "Unknown Author" }],
    openGraph: post.bannerImage
      ? {
          images: [
            {
              url: post.bannerImage,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ],
        }
      : undefined,
  }
}

async function getPostBySlug(slug: string) {
  return db.post.findUnique({
    where: {
      slug,
      published: true,
    },
    include: {
      author: true,
      tags: true,
    },
  })
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="container max-w-4xl py-10">
      <article className="prose prose-stone dark:prose-invert mx-auto max-w-3xl">
        <div className="space-y-2 not-prose mb-8">
          <div className="flex gap-2 mb-4">
            {post.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tag/${tag.slug}`}
                className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full hover:bg-secondary/80"
              >
                {tag.name}
              </Link>
            ))}
          </div>
          <h1 className="text-4xl font-bold">{post.title}</h1>
          <p className="text-xl text-muted-foreground">{post.description}</p>
          <div className="flex items-center gap-4 pt-4">
            <Avatar>
              <AvatarImage src={post.author.image || ""} alt={post.author.name || ""} />
              <AvatarFallback>{post.author.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{post.author.name}</div>
              <div className="text-sm text-muted-foreground">
                {formatDate(post.createdAt)} · {post.readTime} min read
              </div>
            </div>
          </div>
        </div>
        {post.bannerImage && (
          <div className="relative aspect-video overflow-hidden rounded-lg mb-8 not-prose">
            <Image
              src={post.bannerImage || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        <div className="whitespace-pre-wrap">{post.content}</div>
        <Separator className="my-10" />
        <div className="not-prose mb-10">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={post.author.image || ""} alt={post.author.name || ""} />
              <AvatarFallback>{post.author.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Written by</p>
              <h3 className="font-bold">{post.author.name}</h3>
              <p className="text-sm text-muted-foreground">{post.author.bio || "Tech blogger and enthusiast"}</p>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" asChild>
              <Link href={`/author/${post.author.id}`}>More from {post.author.name}</Link>
            </Button>
          </div>
        </div>
        <CommentSection postId={post.id} />
      </article>
    </div>
  )
}

