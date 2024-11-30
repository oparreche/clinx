"use client";

import { useAuth } from "@/auth/context/AuthContext";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { authService } from "@/services/api";
import { LoginCredentials } from "@/auth/types";
import { FaEnvelope, FaLock, FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import Image from 'next/image';

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isValidClinic, setIsValidClinic] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [clinicInfo, setClinicInfo] = useState<{ name?: string; logo?: string } | null>(null);
    const params = useParams();
    const router = useRouter();
    const clinicSlug = params.clinicSlug as string;

    useEffect(() => {
        const validateClinicSlug = async () => {
            try {
                setIsLoading(true);
                const result = await authService.validateClinic(clinicSlug);
                if (!result.valid) {
                    setError(result.message || "Clínica não encontrada. Verifique o endereço e tente novamente.");
                    setIsValidClinic(false);
                    localStorage.removeItem('lastClinicSlug');
                } else {
                    setIsValidClinic(true);
                    setError(null);
                    // setClinicInfo(result.clinic || null);
                    localStorage.setItem('lastClinicSlug', clinicSlug);
                }
            } catch (error) {
                setError("Erro ao validar a clínica. Por favor, tente novamente mais tarde.");
                setIsValidClinic(false);
                localStorage.removeItem('lastClinicSlug');
                console.error("Clinic validation error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        validateClinicSlug();
    }, [clinicSlug]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading || !isValidClinic) return;
        
        setIsLoading(true);
        setError(null);

        try {
            const credentials: LoginCredentials = {
                email,
                password,
                clinicSlug
            };
            await login(credentials);
        } catch (err: any) {
            setError(err.response?.data?.message || "Credenciais inválidas. Por favor, verifique seu email e senha.");
            // Add shake animation to form
            const form = document.querySelector('form');
            form?.classList.add('animate-shake');
            setTimeout(() => form?.classList.remove('animate-shake'), 500);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isValidClinic) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50/90 to-white/90 relative">
                <div 
                    className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat animate-fade-in"
                    style={{
                        backgroundImage: 'url("/images/medical-bg.jpg")',
                        filter: 'brightness(0.95)'
                    }}
                />
                <div className="w-full max-w-[400px] space-y-6 bg-white/95 p-8 rounded-2xl shadow-xl backdrop-blur-sm mx-4 animate-zoom-in">
                    <div className="text-center">
                        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
                            <FaExclamationCircle className="mx-auto h-12 w-12 text-red-500" />
                            <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
                                Ops!
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                {error || "Clínica não encontrada. Verifique o endereço e tente novamente."}
                            </p>
                            <button
                                onClick={() => router.push(`/${clinicSlug}`)}
                                className="mt-6 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-150 hover:scale-105"
                            >
                                Voltar para a página inicial
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50/90 to-white/90 relative">
            <div 
                className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat animate-fade-in"
                style={{
                    backgroundImage: 'url("/images/medical-bg.jpg")',
                    filter: 'brightness(0.95)'
                }}
            />
            <div className="w-full max-w-[400px] space-y-6 bg-white/95 p-8 rounded-2xl shadow-xl backdrop-blur-sm mx-4 animate-zoom-in">
                <div className="text-center">
                    <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
                        {clinicInfo?.logo ? (
                            <div className="flex justify-center mb-8">
                                <Image
                                    src={clinicInfo.logo}
                                    alt="Logo da Clínica"
                                    width={120}
                                    height={120}
                                    className="rounded-full"
                                />
                            </div>
                        ) : (
                            <div className="h-24 w-24 mx-auto mb-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                <span className="text-3xl font-bold text-indigo-600">
                                    {clinicInfo?.name?.[0]?.toUpperCase() || clinicSlug[0]?.toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {clinicInfo?.name || "Bem-vindo(a)"}
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Entre com suas credenciais para acessar o sistema
                        </p>
                    </div>
                </div>
                
                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="animate-slide-in" style={{ animationDelay: '600ms' }}>
                            <div className="relative">
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full px-4 py-3.5 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm hover:bg-white/90"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        
                        <div className="animate-slide-in" style={{ animationDelay: '800ms' }}>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    className="block w-full px-4 py-3.5 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm hover:bg-white/90"
                                    placeholder="Senha"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-md bg-indigo-50 p-4 animate-fade-in">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <FaExclamationCircle className="h-5 w-5 text-indigo-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-indigo-800">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="animate-slide-up" style={{ animationDelay: '1000ms' }}>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                                isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 hover:scale-[1.02]`}
                        >
                            {isLoading ? (
                                <FaSpinner className="h-5 w-5 animate-spin" />
                            ) : (
                                "Entrar"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}