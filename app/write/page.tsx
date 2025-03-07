"use client"

import { useRouter } from "next/navigation"
import { Editor, type EditorFormValues } from "@/components/editor"
import { useToast } from "@/components/ui/use-toast"
import { slugify } from "@/lib/utils"

export default function WritePage() {
  const router = useRouter()
  const { toast } = useToast()

  async function onSubmit(values: EditorFormValues) {
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          slug: await slugify(values.title),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create post")
      }

      const data = await response.json()
      router.push(`/dashboard`)
    } catch (error) {
      console.error("Error submitting post:", error)
      toast({
        title: "Error",
        description: "There was a problem creating your post.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Write an Article</h1>
          <p className="text-muted-foreground">Create and publish your article for the tech community</p>
        </div>
        <Editor onSubmit={onSubmit} />
      </div>
    </div>
  )
}

