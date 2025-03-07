"use client"

import * as React from "react"
import { X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Command } from "@/components/ui/command"
import { Command as CommandPrimitive } from "cmdk"

interface TagInputProps {
  placeholder?: string
  tags: string[]
  setTags: (tags: string[]) => void
  disabled?: boolean
}

export function TagInput({ placeholder = "Add tag...", tags, setTags, disabled = false }: TagInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = React.useState("")

  const handleUnselect = React.useCallback(
    (index: number) => {
      setTags(tags.filter((_, i) => i !== index))
    },
    [tags, setTags],
  )

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const target = e.target as HTMLInputElement
      if (e.key === "Enter" && inputValue) {
        e.preventDefault()
        const lowercasedInput = inputValue.toLowerCase()
        const normalizedInput = lowercasedInput
          .trim()
          .replace(/\s+/g, "-") // Replace spaces with hyphens
          .replace(/[^\w-]+/g, "") // Remove non-word chars
          .replace(/--+/g, "-") // Replace multiple hyphens with single
          .replace(/^-+/, "") // Trim hyphens from start
          .replace(/-+$/, "") // Trim hyphens from end

        if (normalizedInput && !tags.includes(normalizedInput) && tags.length < 5) {
          setTags([...tags, normalizedInput])
          setInputValue("")
        }
      } else if (e.key === "Backspace" && !target.value && tags.length > 0) {
        handleUnselect(tags.length - 1)
      }
    },
    [inputValue, tags, setTags, handleUnselect],
  )

  return (
    <Command className="overflow-visible bg-transparent" onKeyDown={handleKeyDown}>
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="mb-1">
              {tag}
              <button
                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onClick={() => handleUnselect(index)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            className="ml-1 bg-transparent outline-none placeholder:text-muted-foreground flex-1 h-7"
            placeholder={tags.length < 5 ? placeholder : ""}
            disabled={disabled || tags.length >= 5}
          />
        </div>
      </div>
    </Command>
  )
}

