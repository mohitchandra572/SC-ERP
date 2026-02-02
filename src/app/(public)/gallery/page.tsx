'use client'

import { PageHeader } from "@/components/layout/page-header"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Search, Image as ImageIcon, Camera } from "lucide-react"

const categories = [
    { id: 'all', labelBn: "সব ছবি", labelEn: "All Photos" },
    { id: 'campus', labelBn: "ক্যাম্পাস", labelEn: "Campus" },
    { id: 'events', labelBn: "অনুষ্ঠান", labelEn: "Events" },
    { id: 'sports', labelBn: "খেলাধুলা", labelEn: "Sports" },
    { id: 'classes', labelBn: "শ্রেণীকক্ষ", labelEn: "Classroom" }
]

const images = [
    { id: 1, category: 'campus', url: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=800&q=80', titleBn: "মূল ভবন", titleEn: "Main Building" },
    { id: 2, category: 'events', url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80', titleBn: "পুরস্কার বিতরণী", titleEn: "Prize Giving Ceremony" },
    { id: 3, category: 'sports', url: 'https://images.unsplash.com/photo-1544694071-d833bb1ac794?w=800&q=80', titleBn: "বার্ষিক ক্রীড়া প্রতিযোগিতা", titleEn: "Annual Sports" },
    { id: 4, category: 'classes', url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80', titleBn: "কম্পিউটার ল্যাব", titleEn: "Computer Lab" },
    { id: 5, category: 'campus', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80', titleBn: "লাইব্রেরি", titleEn: "Library" },
    { id: 6, category: 'events', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80', titleBn: "সাংস্কৃতিক অনুষ্ঠান", titleEn: "Cultural Event" },
    { id: 7, category: 'sports', url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80', titleBn: "ফুটবল টুর্নামেন্ট", titleEn: "Football Tournament" },
    { id: 8, category: 'classes', url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80', titleBn: "বিজ্ঞান ল্যাব", titleEn: "Science Lab" },
    { id: 9, category: 'campus', url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80', titleBn: "খেলার মাঠ", titleEn: "Playground" }
]

export default function GalleryPage() {
    const [activeTab, setActiveTab] = useState('all')

    const filteredImages = activeTab === 'all'
        ? images
        : images.filter(img => img.category === activeTab)

    return (
        <div className="container mx-auto px-4 max-w-7xl">
            <PageHeader
                variant="hero"
                title="ফটো গ্যালারি"
                description="আমাদের প্রতিষ্ঠানের আনন্দঘন মুহূর্ত, বার্ষিক অনুষ্ঠান এবং উন্নত ক্যাম্পাসের এক ঝলক।"
            />

            {/* Filters */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveTab(cat.id)}
                        className={`px-8 py-3 rounded-2xl font-black font-bengali transition-all duration-300 ${activeTab === cat.id
                                ? "bg-school-navy text-white shadow-xl shadow-navy/20 scale-105"
                                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                            }`}
                    >
                        {cat.labelBn}
                    </button>
                ))}
            </div>

            {/* Gallery Grid */}
            <motion.div
                layout
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-24"
            >
                <AnimatePresence mode="popLayout">
                    {filteredImages.map((img) => (
                        <motion.div
                            key={img.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4 }}
                            className="group relative h-80 rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-xl bg-white"
                        >
                            <img
                                src={img.url}
                                alt={img.titleEn}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                                <div className="space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="flex items-center gap-2 text-blue-400 font-bold text-sm uppercase tracking-widest">
                                        <Camera className="w-4 h-4" />
                                        {categories.find(c => c.id === img.category)?.labelEn}
                                    </div>
                                    <h3 className="text-2xl font-black text-white font-bengali">
                                        {img.titleBn}
                                    </h3>
                                    <p className="text-white/60 text-sm font-medium">
                                        {img.titleEn}
                                    </p>
                                </div>
                            </div>

                            {/* Icon Indicator */}
                            <div className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <ImageIcon className="w-5 h-5" />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Bottom Section */}
            <div className="bg-slate-50 border border-slate-200 rounded-[3.5rem] p-12 mb-24 relative overflow-hidden">
                <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full" />
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-black text-slate-900 font-bengali">আপনি কি কোনো নির্দিষ্ট ছবি খুঁজছেন?</h2>
                        <p className="text-slate-600 font-medium text-lg">
                            আমাদের কাছে বিশদ আর্কাইভ রয়েছে। কোনো বিশেষ অনুষ্ঠান বা বছরের ছবি দেখতে চাইলে আমাদের সাথে যোগাযোগ করুন।
                        </p>
                        <div className="flex items-center gap-4">
                            <button className="bg-school-navy text-white font-black px-8 py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-lg">
                                যোগাযোগ করুন
                            </button>
                            <button className="text-slate-600 font-bold hover:text-slate-900 flex items-center gap-2 px-6">
                                <Search className="w-5 h-5" /> আর্কাইভ দেখুন
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-40 rounded-3xl bg-blue-100/50 animate-pulse" />
                        <div className="h-40 rounded-3xl bg-slate-200/50 mt-8 animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    )
}
