import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail, Calendar, MapPin, Instagram } from "lucide-react"

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface border-t border-white/10 mt-24 py-5">
      <div className="container py-16 md:py-20 pt-20 md:pt-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/images/design-mode/download.png"
                alt="Sapphire MUN"
                className="h-10 w-auto flex-shrink-0"
              />
              <span className="text-xl font-bold text-fg">Sapphire MUN</span>
            </Link>
            <p className="text-muted max-w-md">Experience‑first design. India's first Experience‑targeted Model UN.</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-fg">Quick Links</h3>
            <div className="space-y-2">
              <Link href="#experience" className="block text-muted hover:text-accent transition-colors">
                Experience
              </Link>
              <Link href="#committees" className="block text-muted hover:text-accent transition-colors">
                Committees
              </Link>
              <Link href="/docs" className="block text-muted hover:text-accent transition-colors">
                Resources
              </Link>
              <Link
                href="https://v0-mun-website-system.vercel.app"
                className="block text-muted hover:text-accent transition-colors"
              >
                Integrated Tech Experience
              </Link>
            </div>
          </div>

          {/* Contact & Register */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-fg">Get Involved</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted">
                <Mail className="w-4 text-accent h-4" />
                <a href="mailto:thesapphiremun@gmail.com" className="hover:text-accent transition-colors py-3">
                  thesapphiremun@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted">
                <Instagram className="w-4 text-accent h-4" />
                <a
                  href="https://www.instagram.com/sapphire_mun/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors py-2.5"
                >
                  @sapphire_mun
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted">
                <Calendar className="h-4 w-4 text-accent" />
                <span className="py-2.5">15–17 August, 2025</span>
              </div>
              <div className="flex items-center gap-2 text-muted">
                <MapPin className="h-4 w-4 text-accent" />
                <span className="py-2.5">Sanskriti Degree College, Kondapur</span>
              </div>
              <Button asChild className="btn-accent w-full mt-4">
                <Link href="https://drive.google.com/drive/folders/1ZU8qseZSVTgjZN_Aj4UoKOMeccxGQrUl?usp=drive_link" target="_blank" rel="noopener noreferrer">
                  Thank you all for a great first edition!
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center pb-0.5">
          <p className="text-sm text-muted">
            Sapphire Model United Nations. All rights reserved. | Site Made by{" "}
            <a
              href="https://in.linkedin.com/in/dhruva-sammeta-19198a291"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent/100 "
            >
              <span className="font-semibold metallic-text"> Dhruva Sammeta</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
