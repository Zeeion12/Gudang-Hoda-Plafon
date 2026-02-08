import type { ReactNode } from 'react';
import { MdWarehouse } from 'react-icons/md';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-linear-to-br from-(--color-surface-dark) via-(--color-surface-medium) to-(--color-action-primary)">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `
              linear-gradient(var(--color-surface-light) 1px, transparent 1px),
              linear-gradient(90deg, var(--color-surface-light) 1px, transparent 1px)
            `,
                        backgroundSize: '50px 50px',
                    }}
                />

                {/* Animated Gradient Orbs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-(--color-surface-light) blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.2, 0.25, 0.2],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1,
                    }}
                    className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-(--color-action-primary) blur-3xl"
                />
            </div>

            {/* Content Container */}
            <div className="relative flex min-h-screen items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Logo / Brand */}
                    <div className="mb-8 text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 15,
                                delay: 0.2
                            }}
                            className="mb-4 flex justify-center"
                        >
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                                <MdWarehouse className="h-9 w-9 text-white" />
                            </div>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-3xl font-bold text-white"
                        >
                            Warehouse Management
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="mt-2 text-sm text-white/70"
                        >
                            Manage your inventory with ease
                        </motion.p>
                    </div>

                    {/* Auth Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="rounded-2xl bg-white p-8 shadow-2xl"
                    >
                        {children}
                    </motion.div>

                    {/* Footer */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-6 text-center text-sm text-white/60"
                    >
                        © 2024 WMS. Built with React & Supabase
                    </motion.p>
                </motion.div>
            </div>
        </div>
    );
}