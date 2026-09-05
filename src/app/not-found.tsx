import Link from 'next/link'
import { HeartPulse, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 text-center">
      <div className="mb-8 flex size-20 items-center justify-center rounded-3xl bg-blue-100 dark:bg-blue-900/30">
        <HeartPulse className="size-10 text-blue-600 dark:text-blue-500" />
      </div>
      <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">404 - Page Not Found</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved to another URL.
      </p>
      <div className="flex gap-4">
        <Link href="/">
          <Button size="lg">Return Home</Button>
        </Link>
        <Link href="/doctors">
          <Button variant="outline" size="lg" className="gap-2">
            <Search className="size-4" /> Find a Doctor
          </Button>
        </Link>
      </div>
    </div>
  )
}
