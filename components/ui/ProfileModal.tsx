'use client';

import { useState } from 'react';
import { useProgressStore } from "@/store/useProgressStore";
import { Button } from "@/components/ui/Button";
import { Heart, Star, User, LogIn, LogOut, Cloud, CloudOff, Loader2, Settings } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useCloudSync } from '@/hooks/useCloudSync';
import { useAdmin } from '@/hooks/useAdmin';
import { AuthModal } from '@/components/auth/AuthModal';
import Link from 'next/link';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
    const { name, xp, hearts, maxHearts, refillHearts, setName } = useProgressStore();
    const { user, signOut, loading: authLoading } = useAuth();
    const { syncToCloud, syncFromCloud } = useCloudSync();
    const { isAdmin } = useAdmin();

    const [showAuthModal, setShowAuthModal] = useState(false);
    const [syncing, setSyncing] = useState(false);

    if (!isOpen) return null;

    const handleSync = async () => {
        if (!user) return;
        setSyncing(true);
        await syncToCloud(user);
        setSyncing(false);
    };

    const handleLogout = async () => {
        if (!user) return;
        // Sync before logout
        await syncToCloud(user);
        await signOut();
    };

    return (
        <>
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                    <div className="bg-gray-100 p-6 flex flex-col items-center border-b">
                        <div className="w-20 h-20 bg-duo-blue-face rounded-full flex items-center justify-center mb-4 text-white shadow-lg border-4 border-white">
                            <User size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">{name || "Guest"}</h2>
                        {user ? (
                            <p className="text-duo-blue-face text-sm flex items-center gap-1">
                                <Cloud size={14} /> {user.email}
                            </p>
                        ) : (
                            <p className="text-gray-500 text-sm flex items-center gap-1">
                                <CloudOff size={14} /> ローカルのみ
                            </p>
                        )}
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 flex flex-col items-center">
                                <Star className="text-yellow-500 mb-2 fill-current" />
                                <span className="text-xl font-bold text-gray-800">{xp}</span>
                                <span className="text-xs font-bold text-yellow-600 uppercase">Total XP</span>
                            </div>
                            <div className="bg-red-50 p-4 rounded-xl border border-red-200 flex flex-col items-center">
                                <Heart className="text-red-500 mb-2 fill-current" />
                                <span className="text-xl font-bold text-gray-800">{hearts} / {maxHearts}</span>
                                <span className="text-xs font-bold text-red-600 uppercase">Hearts</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                            <Button
                                variant={hearts < maxHearts ? "primary" : "locked"}
                                fullWidth
                                onClick={() => {
                                    if (hearts < maxHearts) refillHearts();
                                }}
                                disabled={hearts >= maxHearts}
                            >
                                {hearts >= maxHearts ? "Hearts Full" : "Refill Hearts (Free)"}
                            </Button>

                            {user ? (
                                <>
                                    <Button
                                        variant="secondary"
                                        fullWidth
                                        onClick={handleSync}
                                        disabled={syncing}
                                    >
                                        {syncing ? (
                                            <><Loader2 className="animate-spin mr-2" size={18} /> 同期中...</>
                                        ) : (
                                            <><Cloud className="mr-2" size={18} /> クラウドに保存</>
                                        )}
                                    </Button>
                                    <Button variant="danger" fullWidth onClick={handleLogout}>
                                        <LogOut className="mr-2" size={18} /> ログアウト
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="secondary"
                                    fullWidth
                                    onClick={() => setShowAuthModal(true)}
                                >
                                    <LogIn className="mr-2" size={18} /> ログイン / 登録
                                </Button>
                            )}

                            {isAdmin && (
                                <Link href="/admin/problems" onClick={onClose}>
                                    <Button variant="outline" fullWidth>
                                        <Settings className="mr-2" size={18} /> Admin Panel
                                    </Button>
                                </Link>
                            )}

                            <Button variant="ghost" fullWidth onClick={onClose}>
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </>
    );
}
