<nav x-data="{ open: false }" class="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
            <div class="flex items-center">
                <a href="{{ route('dashboard') }}" class="flex items-center space-x-2 text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    <i class="fas fa-wifi text-2xl"></i>
                    <span>WiFi Speed Test</span>
                </a>
            </div>
            <div class="hidden sm:flex sm:items-center sm:space-x-4">
                <a href="{{ route('dashboard') }}" class="px-3 py-2 rounded-md text-sm font-medium {{ request()->routeIs('dashboard') ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700' }}">Beranda</a>
                <a href="{{ route('network.tools') }}" class="px-3 py-2 rounded-md text-sm font-medium {{ request()->routeIs('network.tools') ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700' }}">Network Tools</a>
                <a href="{{ route('history.index') }}" class="px-3 py-2 rounded-md text-sm font-medium {{ request()->routeIs('history.*') ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700' }}">History</a>
                <form method="POST" action="{{ route('logout') }}">
                    @csrf
                    <button type="submit" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</button>
                </form>
                <!-- Dark mode toggle -->
                <button id="theme-toggle" class="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-200">
                    <i id="theme-icon" class="fas fa-moon"></i>
                </button>
            </div>
            <div class="sm:hidden flex items-center">
                <button @click="open = ! open" class="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-200">
                    <i class="fas fa-bars"></i>
                </button>
            </div>
        </div>
    </div>
    <div x-show="open" class="sm:hidden px-2 pt-2 pb-3 space-y-1">
        <a href="{{ route('dashboard') }}" class="block px-3 py-2 rounded-md text-base font-medium {{ request()->routeIs('dashboard') ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700' }}">Beranda</a>
        <a href="{{ route('network.tools') }}" class="block px-3 py-2 rounded-md text-base font-medium {{ request()->routeIs('network.tools') ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700' }}">Network Tools</a>
        <a href="{{ route('history.index') }}" class="block px-3 py-2 rounded-md text-base font-medium {{ request()->routeIs('history.*') ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700' }}">History</a>
        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit" class="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</button>
        </form>
    </div>
</nav>