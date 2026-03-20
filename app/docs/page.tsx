"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, ExternalLink } from "lucide-react"
import FloatingNavbar from "@/components/floating-navbar"
import Footer from "@/components/footer"

export default function DocsPage() {
  const documents = [
    {
      title: "Schedule",
      description: "Complete conference schedule and timeline for all three days",
      status: "Available",
      link: "https://drive.google.com/drive/folders/156jzi6shKIxdVn1NCqrhIIvuXXwUgEEI?usp=drive_link",
    },
    {
      title: "Code of Conduct",
      description: "Expected behavior and guidelines for all participants",
      status: "Available",
      link: "https://drive.google.com/file/d/1qBvpZD26KGsBUmk1_sihgwob_hhpn8zy/view?usp=sharing",
    },
    {
      title: "Liability form",
      description: "Procedural and formality form mandatory to be signed and brought by all delegates",
      status: "Available",
      link: "https://drive.google.com/file/d/16k1LsZpw0nJnzN3g1tW5b0ePdrQXohQf/view?usp=drive_link",
    },
    {
      title: "Background Guides",
      description: "Committee-specific background information and research materials",
      status: "Available",
      link: "https://drive.google.com/drive/folders/197TAHdk-qhutra_iNpsrixhr6P4TlArA?usp=drive_link",
    },
  ]

  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      <FloatingNavbar />

      <div className="pt-24 pb-8">
        <div className="container">
          <Link href="/" className="inline-flex items-center text-gray-300 hover:text-white transition-colors text-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>

      <div className="container pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Conference <span className="text-white">Resources</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Essential documents and guides to help you prepare for Sapphire MUN.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button asChild className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-6 py-6 text-base">
              <Link
                href="https://drive.google.com/drive/folders/197TAHdk-qhutra_iNpsrixhr6P4TlArA?usp=drive_link"
                target="_blank"
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                Access Google Drive
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-gray-600 bg-[#1a2942] hover:bg-[#243552] text-white px-6 py-6 text-base"
            >
              <Link href="/#contact">Contact Us</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="bg-[#1a2942] rounded-2xl p-8 border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-3 h-3 rounded-full bg-green-500 mt-2" />
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                      {doc.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-3">{doc.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{doc.description}</p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      size="sm"
                      className="bg-[#0f1c2e] hover:bg-[#1a2942] text-white border border-gray-600 px-4 py-5"
                      asChild
                    >
                      <Link href={doc.link} target="_blank">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[#0f1c2e] hover:bg-[#1a2942] text-white border border-gray-600 px-4 py-5"
                      asChild
                    >
                      <Link href={doc.link} target="_blank">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Online
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
