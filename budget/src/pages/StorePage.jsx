
import React from 'react';
import { Helmet } from 'react-helmet';
import ProductsList from '@/components/ProductsList';

const StorePage = () => {
  return (
    <>
      <Helmet>
        <title>Loja - Nanda 3D Arte</title>
        <meta name="description" content="Explore nossa coleção de produtos exclusivos de impressão 3D." />
      </Helmet>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Nossa Loja
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Descubra criações únicas e projetos especiais, todos feitos com a magia da impressão 3D.
          </p>
        </div>
        <ProductsList />
      </div>
    </>
  );
};

export default StorePage;
