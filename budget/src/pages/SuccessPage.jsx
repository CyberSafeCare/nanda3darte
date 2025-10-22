
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingBag } from 'lucide-react';

const SuccessPage = () => {
  return (
    <>
      <Helmet>
        <title>Compra Realizada com Sucesso!</title>
        <meta name="description" content="Confirmação de sua compra em nossa loja." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center text-center"
      >
        <div className="glass-effect p-10 rounded-2xl shadow-2xl max-w-lg w-full">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
          >
            <CheckCircle className="h-24 w-24 text-green-400 mx-auto mb-6" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-4">Obrigado pela sua compra!</h1>
          <p className="text-gray-300 mb-8 text-lg">
            Seu pedido foi processado com sucesso. Em breve você receberá um e-mail com os detalhes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/store">
              <Button size="lg" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Continuar Comprando
              </Button>
            </Link>
            <Link to="/">
              <Button size="lg" variant="outline" className="w-full bg-transparent hover:bg-white/10 border-white/20">
                Voltar para a Calculadora
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SuccessPage;
