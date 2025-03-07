import { Suspense } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { db } from "@/lib/db"
import { authOptions } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pencil, Trash, Eye, Plus } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

async function getUserPosts(userId: string) {
  return db.post.findMany({
    where: {
      authorId: userId,
    },
    include: {
      tags: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  })
}

function PostTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="border rounded-lg">
        <div className="p-4">
          <div className="grid grid-cols-4 gap-4">
            <Skeleton className="h-8 col-span-2" />
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
          </div>
        </div>
        <div className="p-4">
          {Array(3)
            .fill(null)
            .map((_, i) => (
              <div key={i} className="grid grid-cols-4 gap-4 py-4">
                <Skeleton className="h-6 col-span-2" />
                <Skeleton className="h-6" />
                <Skeleton className="h-6" />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/sign-in")
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Manage your articles and profile</p>
        </div>
        <Button asChild>
          <Link href="/write">
            <Plus className="mr-2 h-4 w-4" />
            New Article
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts">My Articles</TabsTrigger>
          <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <CardTitle>Your Articles</CardTitle>
              <CardDescription>Manage your published and draft articles</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<PostTableSkeleton />}>
                <PostsTable userId={session.user.id} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bookmarks">
          <Card>
            <CardHeader>
              <CardTitle>Bookmarked Articles</CardTitle>
              <CardDescription>Articles you've saved for later</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading bookmarks...</div>}>
                <BookmarksTable userId={session.user.id} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

async function PostsTable({ userId }: { userId: string }) {
  const posts = await getUserPosts(userId)

  if (posts.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium mb-2">No articles yet</h3>
        <p className="text-muted-foreground mb-4">You haven't created any articles yet. Start writing now!</p>
        <Button asChild>
          <Link href="/write">Create your first article</Link>
        </Button>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell className="font-medium">{post.title}</TableCell>
            <TableCell>{post.published ? <Badge>Published</Badge> : <Badge variant="outline">Draft</Badge>}</TableCell>
            <TableCell>{formatDate(post.updatedAt)}</TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/article/${post.slug}`}>
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/edit/${post.id}`}>
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/delete/${post.id}`}>
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

async function BookmarksTable({ userId }: { userId: string }) {
  const bookmarks = await db.bookmark.findMany({
    where: {
      userId,
    },
    include: {
      post: {
        include: {
          author: true,
          tags: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium mb-2">No bookmarks yet</h3>
        <p className="text-muted-foreground mb-4">
          You haven't bookmarked any articles yet. Browse and save articles that interest you.
        </p>
        <Button asChild>
          <Link href="/">Browse Articles</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookmarks.map((bookmark) => (
        <Card key={bookmark.id}>
          <CardContent className="p-6">
            <div className="grid gap-2">
              <div className="flex gap-2">
                {bookmark.post.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag.id} variant="secondary">
                    {tag.name}
                  </Badge>
                ))}
              </div>
              <Link href={`/article/${bookmark.post.slug}`}>
                <h3 className="text-xl font-bold hover:underline">{bookmark.post.title}</h3>
              </Link>
              <p className="text-muted-foreground">{bookmark.post.description}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                <span>By {bookmark.post.author.name}</span>
                <span>•</span>
                <span>{formatDate(bookmark.post.createdAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

