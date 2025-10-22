
import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Calculator } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

const Header = ({ onCartClick }) => {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const navLinkClasses = ({ isActive }) =>
    `relative text-lg font-medium transition-colors duration-300 ${
      isActive ? 'text-white' : 'text-gray-400 hover:text-white'
    }`;

  const Underline = () => (
    <motion.div
      className="absolute bottom-[-4px] left-0 right-0 h-[2px] bg-purple-500"
      layoutId="underline"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    />
  );

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-40"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 bg-black/30 backdrop-blur-lg rounded-b-2xl px-6 shadow-lg">
          <NavLink to="/" className="flex items-center gap-3">
            <img src="https://horizons-cdn.hostinger.com/10a8c933-d5ea-4ab2-a7e2-e95bfb13c75f/74bdd9471562cd6501959320b32dad89.png" alt="Logo" className="h-10 w-auto" />
            <span className="text-xl font-bold text-white hidden sm:block">Nanda 3D Arte</span>
          </NavLink>

          <nav className="flex items-center gap-6">
            <NavLink to="/" className={navLinkClasses}>
              {({ isActive }) => (
                <>
                  <Calculator className="w-5 h-5 mr-2 inline-block sm:hidden" />
                  <span className="hidden sm:inline">Calculadora</span>
                  {isActive && <Underline />}
                </>
              )}
            </NavLink>
            <NavLink to="/store" className={navLinkClasses}>
              {({ isActive }) => (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2 inline-block sm:hidden" />
                  <span className="hidden sm:inline">Loja</span>
                  {isActive && <Underline />}
                </>
              )}
            </NavLink>
          </nav>

          <div className="relative">
            <Button onClick={onCartClick} variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ShoppingCart />
            </Button>
            {totalItems > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
              >
                {totalItems}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
