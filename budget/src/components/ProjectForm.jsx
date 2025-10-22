
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Send, History } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { InputField } from '@/components/ui/InputField';

const ProjectForm = ({ onComplete, onBack, onShowHistory }) => {
  const [description, setDescription] = useState('');
  const [executionTime, setExecutionTime] = useState('');
  const [hourlyRate, setHourlyRate] = useState('50,00');
  const [materialsCost, setMaterialsCost] = useState('0,00');
  const [softwareCost, setSoftwareCost] = useState('0,00');
  const [otherCosts, setOtherCosts] = useState('0,00');
  const [deadline, setDeadline] = useState('');

  const parseCurrency = (value) => {
    if (typeof value !== 'string') return Number(value) || 0;
    return Number(value.replace(/\./g, '').replace(',', '.')) || 0;
  };

  const handleCurrencyChange = (setter) => (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9,.]/g, '');
    const parts = value.split(/[,.]/);
    if (parts.length > 2) {
      value = parts[0] + ',' + parts.slice(1).join('');
    }
    setter(value);
  };

  const calculateTotal = () => {
    const totalExecution = parseCurrency(executionTime) * parseCurrency(hourlyRate);
    const totalMaterials = parseCurrency(materialsCost);
    const totalSoftware = parseCurrency(softwareCost);
    const totalOther = parseCurrency(otherCosts);
    return totalExecution + totalMaterials + totalSoftware + totalOther;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !executionTime || !hourlyRate) {
      toast({
        title: "Preenchimento Incompleto",
        description: "Por favor, preencha a descrição, tempo de execução e valor da hora.",
        variant: "destructive",
      });
      return;
    }
    
    const total = calculateTotal();

    onComplete({
      description,
      executionTime,
      hourlyRate,
      materialsCost,
      softwareCost,
      otherCosts,
      deadline,
      total,
      quantity: 1, // Project is a single item
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="w-full"
    >
      <div className="flex justify-between items-center mb-4">
        <Button onClick={onBack} variant="outline" className="bg-transparent hover:bg-white/10 border-white/20">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
        </Button>
        <Button onClick={onShowHistory} variant="outline" className="bg-transparent hover:bg-white/10 border-white/20">
          <History className="w-4 h-4 mr-2" /> Histórico
        </Button>
      </div>
      <div className="glass-effect rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-start gap-4 mb-8 px-4">
            <motion.img 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                src="https://horizons-cdn.hostinger.com/10a8c933-d5ea-4ab2-a7e2-e95bfb13c75f/74bdd9471562cd6501959320b32dad89.png" 
                alt="Logo Nanda 3D Arte" 
                className="h-24 w-auto"
            />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                Novo Projeto
            </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-300">Descrição Detalhada do Projeto</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o escopo do projeto, requisitos e quaisquer detalhes relevantes."
              className="bg-gray-800/50 border-gray-700 text-white h-32 text-lg"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <InputField 
              id="executionTime" 
              label="Tempo de Execução Estimado" 
              type="text" // Changed to text to allow comma input
              value={executionTime} 
              onChange={handleCurrencyChange(setExecutionTime)} 
              placeholder="0,00" 
              unit="horas"
              required
            />
            <InputField 
              id="hourlyRate" 
              label="Valor da Sua Hora de Trabalho" 
              type="text" // Changed to text to allow comma input
              value={hourlyRate} 
              onChange={handleCurrencyChange(setHourlyRate)} 
              placeholder="0,00" 
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <InputField 
              id="materialsCost" 
              label="Custo de Materiais Adicionais" 
              type="text" // Changed to text
              value={materialsCost} 
              onChange={handleCurrencyChange(setMaterialsCost)} 
              placeholder="0,00" 
            />
            <InputField 
              id="softwareCost" 
              label="Custo de Softwares/Licenças" 
              type="text" // Changed to text
              value={softwareCost} 
              onChange={handleCurrencyChange(setSoftwareCost)} 
              placeholder="0,00" 
            />
            <InputField 
              id="otherCosts" 
              label="Outros Custos" 
              type="text" // Changed to text
              value={otherCosts} 
              onChange={handleCurrencyChange(setOtherCosts)} 
              placeholder="0,00" 
            />
          </div>

          <InputField 
            id="deadline" 
            label="Prazo de Entrega (Opcional)" 
            value={deadline} 
            onChange={(e) => setDeadline(e.target.value)} 
            placeholder="Ex: 5 dias úteis, 2 semanas" 
          />

          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 border border-blue-400/20">
            <div>
              <p className="text-lg text-gray-300">Valor Total Estimado do Projeto:</p>
              <motion.p 
                key={calculateTotal()}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent"
              >
                R$ {calculateTotal().toFixed(2).replace('.', ',')}
              </motion.p>
            </div>
            <Button type="submit" size="lg" className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-8 px-10 text-lg rounded-xl shadow-lg hover:shadow-blue-500/20">
              <Send className="w-6 h-6 mr-3" />
              Gerar Orçamento
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ProjectForm;
