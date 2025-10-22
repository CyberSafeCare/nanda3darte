
import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { ArrowLeft, Eye, Trash2, FileText, Box as Cube, Brush } from 'lucide-react';

    const BudgetHistory = ({ budgets, onViewBudget, onDeleteBudget, onBack }) => {
      const formatCurrency = (value) => `R$ ${(Number(value) || 0).toFixed(2).replace('.', ',')}`;
      const formatDate = (dateString) => new Date(dateString).toLocaleDateString('pt-BR');

      return (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="glass-effect rounded-2xl p-8 shadow-2xl w-full"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Histórico de Orçamentos</h1>
            <Button onClick={onBack} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Início
            </Button>
          </div>

          {budgets.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="mx-auto h-16 w-16 text-gray-500" />
              <h2 className="mt-4 text-xl font-semibold text-gray-300">Nenhum orçamento salvo</h2>
              <p className="mt-2 text-gray-400">Crie um novo orçamento para vê-lo aqui.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {budgets.map((budget, index) => (
                <motion.div
                  key={budget.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-black/20 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                    <div className="flex items-center gap-4 flex-grow">
                        <div className={`p-3 rounded-lg ${budget.type === '3d' ? 'bg-green-500/20' : 'bg-blue-500/20'}`}>
                           {budget.type === '3d' ? <Cube className="w-6 h-6 text-green-300" /> : <Brush className="w-6 h-6 text-blue-300" />}
                        </div>
                        <div>
                            <p className="font-bold text-purple-300">{budget.id}</p>
                            <p className="text-lg font-semibold text-white">{budget.clientData.name}</p>
                            <p className="text-sm text-gray-400">{budget.calculationData.description}</p>
                        </div>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
                     <p className="text-xl font-bold text-green-300">{formatCurrency(budget.calculationData.total)}</p>
                     <p className="text-xs text-gray-500">{formatDate(budget.createdAt)}</p>
                  </div>
                  <div className="flex gap-2 self-end sm:self-center">
                    <Button size="icon" variant="ghost" onClick={() => onViewBudget(budget)} className="text-blue-400 hover:text-blue-300 hover:bg-white/10">
                      <Eye className="w-5 h-5" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => onDeleteBudget(budget.id)} className="text-red-400 hover:text-red-300 hover:bg-white/10">
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      );
    };

    export default BudgetHistory;
