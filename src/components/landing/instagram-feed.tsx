"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Bookmark, Share2, ExternalLink, MoreHorizontal, Instagram } from "lucide-react";
import { InstagramPost } from "@prisma/client";

function PostModal({ post, onClose }: { post: InstagramPost; onClose: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9990] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div
                initial={{ scale: 0.88, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.88, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                className="relative z-10 flex w-full max-w-4xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                style={{ background: "#ffffff", maxHeight: "90vh" }}
                onClick={e => e.stopPropagation()}
            >
                {/* Image */}
                <div className="w-1/2 flex-shrink-0 bg-black">
                    <img src={post.imageUrl} alt={post.caption || "Post"} className="w-full h-full object-cover" style={{ maxHeight: "90vh" }} />
                </div>

                {/* Right panel */}
                <div className="w-1/2 flex flex-col" style={{ background: "#fff" }}>
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                style={{ background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" }}>
                                H
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">himanshu</p>
                                <p className="text-xs text-gray-500">Original Post</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Caption */}
                    <div className="flex-1 overflow-y-auto px-4 py-3">
                        {post.caption && (
                            <div className="flex gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                                    style={{ background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" }}>
                                    H
                                </div>
                                <div>
                                    <span className="text-sm font-semibold text-gray-900 mr-1">himanshu</span>
                                    <span className="text-sm text-gray-800">{post.caption}</span>
                                </div>
                            </div>
                        )}
                        <p className="text-xs text-gray-400 mt-2">View all {post.comments} comments</p>
                    </div>

                    {/* Actions */}
                    <div className="border-t border-gray-100 px-4 py-3">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-4">
                                <Heart className="w-6 h-6 text-gray-800 cursor-pointer hover:text-red-500 transition-colors" />
                                <MessageCircle className="w-6 h-6 text-gray-800 cursor-pointer hover:text-gray-600 transition-colors" />
                                <Share2 className="w-6 h-6 text-gray-800 cursor-pointer hover:text-gray-600 transition-colors" />
                            </div>
                            <Bookmark className="w-6 h-6 text-gray-800 cursor-pointer hover:text-gray-600 transition-colors" />
                        </div>
                        <p className="text-sm font-semibold text-gray-900">{post.likes.toLocaleString()} likes</p>
                        {post.postUrl && (
                            <a
                                href={post.postUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs text-blue-500 hover:underline mt-2"
                            >
                                <ExternalLink className="w-3 h-3" />
                                View on Instagram
                            </a>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export function InstagramFeed({
    posts,
    instagramUrl,
}: {
    posts: InstagramPost[];
    instagramUrl?: string | null;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });
    const [activePost, setActivePost] = useState<InstagramPost | null>(null);

    if (!posts || posts.length === 0) return null;

    return (
        <div ref={ref} className="w-full max-w-2xl mx-auto">
            {/* Heading */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="text-center mb-8"
            >
                <p className="text-xs font-semibold tracking-[0.3em] uppercase text-muted-foreground mb-2">Life in frames</p>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                    Catch me on{" "}
                    <span className="text-gradient-neon" style={{
                        background: "linear-gradient(90deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}>
                        Instagram
                    </span>{" "}✦
                </h2>
                {instagramUrl && (
                    <a
                        href={instagramUrl.startsWith("http") ? instagramUrl : `https://instagram.com/${instagramUrl.replace("@","")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Instagram className="w-3.5 h-3.5" />
                        {instagramUrl.startsWith("http") ? instagramUrl.replace(/https?:\/\/(www\.)?instagram\.com\/?/,"@") : instagramUrl}
                    </a>
                )}
            </motion.div>

            {/* Posts grid — 3 columns like Instagram */}
            <div className="grid grid-cols-3 gap-1">
                {posts.map((post, i) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.05 * i, duration: 0.4 }}
                        className="group relative aspect-square overflow-hidden cursor-pointer bg-muted rounded-sm"
                        onClick={() => setActivePost(post)}
                    >
                        <img
                            src={post.imageUrl}
                            alt={post.caption || `Post ${i + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-5">
                            <div className="flex items-center gap-1.5 text-white font-bold text-sm">
                                <Heart className="w-5 h-5 fill-white" />
                                {post.likes.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-1.5 text-white font-bold text-sm">
                                <MessageCircle className="w-5 h-5 fill-white" />
                                {post.comments.toLocaleString()}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {activePost && (
                    <PostModal post={activePost} onClose={() => setActivePost(null)} />
                )}
            </AnimatePresence>
        </div>
    );
}
