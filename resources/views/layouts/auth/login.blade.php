@extends('layouts.guest')

@section('title', 'Login - WiFi Speed Test')

@section('content')
<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 dark:from-gray-900 dark:via-gray-800 dark:to-black px-4 py-12">
    <div class="w-full max-w-md" data-aos="fade-up">
        <div class="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-8">
            <div class="text-center mb-6">
                <i class="fas fa-wifi text-5xl text-indigo-400"></i>
                <h2 class="mt-3 text-2xl font-bold text-white">WiFi Speed Test</h2>
                <p class="text-white/70 text-sm">Silakan login untuk melanjutkan</p>
            </div>
            <form method="POST" action="{{ route('login') }}">
                @csrf
                <div class="mb-4">
                    <label class="block text-white text-sm mb-1">Email</label>
                    <div class="relative">
                        <i class="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-white/50"></i>
                        <input type="email" name="email" value="{{ old('email') }}" required autofocus
                               class="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                               placeholder="email@example.com">
                    </div>
                </div>
                <div class="mb-4">
                    <label class="block text-white text-sm mb-1">Password</label>
                    <div class="relative" x-data="{ show: false }">
                        <i class="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-white/50"></i>
                        <input :type="show ? 'text' : 'password'" name="password" required
                               class="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                               placeholder="Password">
                        <button type="button" @click="show = !show" class="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white">
                            <i class="fas" :class="show ? 'fa-eye-slash' : 'fa-eye'"></i>
                        </button>
                    </div>
                </div>
                <div class="flex items-center justify-between mb-4 text-sm">
                    <label class="flex items-center text-white/80">
                        <input type="checkbox" name="remember" class="rounded border-white/20 bg-white/10 text-indigo-600 focus:ring-indigo-400">
                        <span class="ml-2">Remember me</span>
                    </label>
                    @if (Route::has('password.request'))
                        <a href="{{ route('password.request') }}" class="text-indigo-400 hover:text-indigo-300">Lupa password?</a>
                    @endif
                </div>
                <button type="submit" class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-lg transition duration-200">
                    <i class="fas fa-sign-in-alt mr-2"></i> Login
                </button>
            </form>
        </div>
    </div>
</div>
@endsection