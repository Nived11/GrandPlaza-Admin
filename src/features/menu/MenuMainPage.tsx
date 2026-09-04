import MenuHeader from '@/features/menu/components/MenuHeader';
import CategoryManager from './components/CategoryManager';
import ProductSection from './components/ProductSection';

export default function MenuMainPage() {
    return (
       <div className="min-h-screen w-full bg-[var(--brand-cream-soft)] text-slate-900 p-2 sm:p-4 lg:p-4 font-sans antialiased space-y-4 sm:space-y-6 overflow-x-hidden">
            <MenuHeader />
            <CategoryManager />
            <ProductSection />
        </div>
    );
}