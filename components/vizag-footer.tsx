import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail, Calendar, MapPin, Instagram, TrendingUp } from "lucide-react"

const VizagFooter: React.FC = () => {
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
                        <p className="text-muted max-w-md">India's first Experience-targeted Model UN. Second edition coming to Vizag.</p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-fg">Quick Links</h3>
                        <div className="space-y-2">
                            <Link href="/" className="block text-muted hover:text-red-400 transition-colors">
                                Home
                            </Link>
                            <Link href="#updates" className="block text-muted hover:text-red-400 transition-colors">
                                Updates
                            </Link>
                            <Link href="/hyderabad" className="block text-muted hover:text-red-400 transition-colors">
                                Hyderabad Edition
                            </Link>
                            <Link
                                href="https://www.instagram.com/sapphiremunvizag/"
                                target="_blank"
                                className="block text-muted hover:text-red-400 transition-colors"
                            >
                                Follow Us
                            </Link>
                        </div>
                    </div>

                    {/* Contact & Register */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-fg">Stay Updated</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-muted">
                                <Mail className="w-4 text-red-400 h-4" />
                                <a href="mailto:thesapphiremun@gmail.com" className="hover:text-red-400 transition-colors py-3">
                                    thesapphiremun@gmail.com
                                </a>
                            </div>
                            <div className="flex items-center gap-2 text-muted">
                                <Instagram className="w-4 text-red-400 h-4" />
                                <a
                                    href="https://www.instagram.com/sapphiremunvizag/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-red-400 transition-colors py-2.5"
                                >
                                    @sapphiremunvizag
                                </a>
                            </div>
                            <div className="flex items-center gap-2 text-muted">
                                <Calendar className="h-4 w-4 text-red-400" />
                                <span className="py-2.5">May 30–31, 2026</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted">
                                <MapPin className="h-4 w-4 text-red-400" />
                                <span className="py-2.5">Visakhapatnam</span>
                            </div>
                            <Button asChild className="btn-accent w-full mt-4 bg-red-600 hover:bg-red-700">
                                <Link href="https://www.instagram.com/sapphiremunvizag/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                                    <TrendingUp className="mr-2 h-4 w-4" />
                                    Get Updates
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
                            className="text-red-400 hover:text-red-300"
                        >
                            <span className="font-semibold">Dhruva Sammeta</span>
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default VizagFooter
