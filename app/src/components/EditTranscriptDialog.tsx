import { useState, useEffect } from 'react'
import { useTranscripts } from '@/contexts/TranscriptContext'
import {
  Button,
  Input,
  Textarea,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui'
import type { Transcript } from '@/types'

interface EditTranscriptDialogProps {
  transcript: Transcript | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditTranscriptDialog({
  transcript,
  open,
  onOpenChange,
}: EditTranscriptDialogProps) {
  const { updateTranscript } = useTranscripts()
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset form when transcript changes
  useEffect(() => {
    if (transcript) {
      setName(transcript.name)
      setContent(transcript.content)
    }
  }, [transcript])

  const handleSubmit = async () => {
    if (!transcript || !name.trim() || !content.trim()) return

    setIsSubmitting(true)
    try {
      await updateTranscript(transcript.id, {
        name: name.trim(),
        content: content.trim(),
      })
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Transcript</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="edit-name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., founder_alice_acme"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-content" className="text-sm font-medium">
              Content
            </label>
            <Textarea
              id="edit-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Interview transcript..."
              className="min-h-[300px] font-mono text-sm"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || !content.trim() || isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
