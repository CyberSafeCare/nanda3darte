
import React from 'react';
import { motion } from 'framer-motion';
import { Box as Cube, Brush } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WelcomeScreen = ({ onStart }) => {
    return (
        <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center flex flex-col items-center justify-center p-8 glass-effect rounded-2xl shadow-2xl"
        >
            <motion.img
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                src="https://horizons-cdn.hostinger.com/10a8c933-d5ea-4ab2-a7e2-e95bfb13c75f/74bdd9471562cd6501959320b32dad89.png"
                alt="Logo Nanda 3D Arte"
                className="w-48 h-48 mx-auto mb-6"
            />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4">
                Bem-vindo(a) à Nanda 3D Arte
            </h1>
            <p className="text-lg text-gray-300 mb-10 max-w-2xl">
                Selecione o tipo de orçamento que deseja criar.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
                <Button
                    onClick={() => onStart('3d')}
                    size="lg"
                    className="w-full sm:w-64 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-8 px-8 text-lg rounded-xl shadow-lg hover:shadow-green-500/20 transform hover:-translate-y-1 transition-all duration-300"
                >
                    <Cube className="w-6 h-6 mr-3" />
                    Impressão 3D
                </Button>
                <Button
                    onClick={() => onStart('project')}
                    size="lg"
                    className="w-full sm:w-64 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-8 px-8 text-lg rounded-xl shadow-lg hover:shadow-blue-500/20 transform hover:-translate-y-1 transition-all duration-300"
                >
                    <Brush className="w-6 h-6 mr-3" />
                    Criação de Projeto
                </Button>
            </div>
        </motion.div>
    );
};

export default WelcomeScreen;
