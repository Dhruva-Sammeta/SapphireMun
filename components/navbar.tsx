import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useMobile } from '@/hooks/use-mobile'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'

const NAV_ITEMS = [
  { href: "#experience", label: "Experience" },
  { href: "#committees", label: "Committees" },
  { href: "#resources", label: "Resources" },
  { href: "#register", label: "Register" },
]

export default function Navbar() {
const isMobile = useMobile()

return (
  <header className="sticky top-0 z-50 bg-header border-b border-b-navy-900/10">
    <div className="container flex items-center justify-between py-4">
      <Link href="/" className="font-semibold text-xl text-navy-900">
        Sapphire MUN
      </Link>

      {isMobile ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="hover:bg-accent/10">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="z-[9999] bg-header border-t border-t-navy-900/10">
            <div className="grid gap-6 p-4 text-center">
              {NAV_ITEMS.map((item) => (
                <Link key={item.href} href={item.href} className="block text-lg text-navy-900 hover:text-accent transition-colors">
                  {item.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <nav className="flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link text-sm font-medium">
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  </header>
)
}
