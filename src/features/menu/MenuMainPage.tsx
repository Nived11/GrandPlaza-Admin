import MenuHeader from '@/features/menu/components/MenuHeader';
import CategoryManager from './components/CategoryManager';

export default function MenuMainPage() {
    return (
       <div className="min-h-screen w-full bg-[var(--brand-cream-soft)] text-gray-900 p-2 sm:p-4 lg:p-4 font-sans antialiased space-y-4 sm:space-y-6 overflow-x-hidden">
            <MenuHeader />
            <CategoryManager />
         
        </div>
    );
}