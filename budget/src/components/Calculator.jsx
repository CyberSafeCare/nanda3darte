
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator as CalculatorIcon, ArrowLeft, History, Plus, Trash2, Edit, X, Wand2, Palette, Box, AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { InputField } from '@/components/ui/InputField';

const renderSection = (title, icon, children) => (
  <div className="bg-white/5 p-6 rounded-xl border border-white/10">
      <div className="flex items-center gap-3 mb-4">
          {icon}
          <h3 className="text-xl font-semibold text-purple-300">{title}</h3>
      </div>
      <div className="space-y-4">
          {children}
      </div>
  </div>
);

const Calculator = ({ onComplete, onShowHistory, onBack }) => {
  const [description, setDescription] = useState('');
  const [materialWeight, setMaterialWeight] = useState('');
  const [materialCost, setMaterialCost] = useState('0,20');
  const [printTime, setPrintTime] = useState('');
  const [printerCost, setPrinterCost] = useState('3,50');
  const [energyCost, setEnergyCost] = useState('1,03');
  const [quantity, setQuantity] = useState(1);
  const [profitMargin, setProfitMargin] = useState(30);
  const [lossMargin, setLossMargin] = useState(10);
  const [otherCosts, setOtherCosts] = useState('0,00');
  
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const settingsSectionRef = useRef(null);

  const [extraItems, setExtraItems] = useState([]);
  const [selectedExtraItem, setSelectedExtraItem] = useState('');

  const [registeredItems, setRegisteredItems] = useState(() => {
      try {
          const saved = localStorage.getItem('registeredItems');
          return saved ? JSON.parse(saved) : [{ id: 'led', name: 'LED', price: 2.50 }];
      } catch (error) {
          return [{ id: 'led', name: 'LED', price: 2.50 }];
      }
  });
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('registeredItems', JSON.stringify(registeredItems));
    } catch (error) {
      console.error("Failed to save registered items:", error);
    }
  }, [registeredItems]);


  const formatCurrency = (value) => {
    const number = Number(value) || 0;
    return `R$ ${number.toFixed(2).replace('.', ',')}`;
  };

  const parseCurrency = (value) => {
    if (typeof value !== 'string') return Number(value) || 0;
    // Replace commas with periods for internal calculation
    return Number(value.replace(/\./g, '').replace(',', '.')) || 0;
  };

  // Helper function for currency input onChange
  const handleCurrencyChange = (setter) => (e) => {
    let value = e.target.value;
    // Allow only numbers, commas, and dots
    value = value.replace(/[^0-9,.]/g, '');
    // Ensure only one comma or dot as decimal separator
    const parts = value.split(/[,.]/);
    if (parts.length > 2) {
      value = parts[0] + ',' + parts.slice(1).join('');
    }
    setter(value);
  };


  const totalMaterialCost = (parseCurrency(materialCost) / 1000) * materialWeight * quantity;
  const totalPrintTimeCost = (parseCurrency(printerCost) + parseCurrency(energyCost)) * parseCurrency(printTime) * quantity;
  const totalOtherCosts = parseCurrency(otherCosts) * quantity;

  const extraItemsTotal = extraItems.reduce((acc, item) => acc + item.price, 0);
  const totalExtraItemsCost = extraItemsTotal * quantity;
  
  const subtotal = totalMaterialCost + totalPrintTimeCost + totalOtherCosts + totalExtraItemsCost;
  const subtotalWithLoss = subtotal * (1 + lossMargin / 100);
  const profit = subtotalWithLoss * (profitMargin / 100);
  const finalTotal = subtotalWithLoss + profit;
  const unitPrice = finalTotal / quantity;

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!description || !materialWeight || !printTime || quantity <= 0) {
      toast({
        title: "Preenchimento Incompleto",
        description: "Por favor, preencha todos os campos obrigatórios para calcular.",
        variant: "destructive",
      });
      return;
    }

    onComplete({
      description,
      quantity,
      materialWeight,
      printTime,
      profitMargin,
      lossMargin,
      total: finalTotal,
      unitPrice: unitPrice,
      insumos: extraItems.map(item => ({ name: item.name, price: item.price })),
      details: {
        totalMaterialCost,
        totalPrintTimeCost,
        totalOtherCosts,
        totalExtraItemsCost,
        profit,
        lossAmount: subtotalWithLoss - subtotal,
      }
    });
  };
  
  const handleEditSettings = () => {
    const newState = !isEditingSettings;
    setIsEditingSettings(newState);
    if (newState) {
       setTimeout(() => {
            settingsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
  };

  const addExtraItem = () => {
    if (!selectedExtraItem) return;
    const itemToAdd = registeredItems.find(item => item.id === selectedExtraItem);
    if (itemToAdd) {
        setExtraItems([...extraItems, { ...itemToAdd, instanceId: Date.now() }]);
        setSelectedExtraItem('');
    }
  };

  const removeExtraItem = (instanceIdToRemove) => {
      setExtraItems(extraItems.filter(item => item.instanceId !== instanceIdToRemove));
  };

  const addRegisteredItem = () => {
    if (!newItemName || !newItemPrice) {
        toast({ title: "Erro", description: "Nome e preço do insumo são obrigatórios.", variant: "destructive" });
        return;
    }
    const newRegisteredItem = {
        id: newItemName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
        name: newItemName,
        price: parseCurrency(newItemPrice)
    };
    setRegisteredItems([...registeredItems, newRegisteredItem]);
    setNewItemName('');
    setNewItemPrice('');
    toast({ title: "Sucesso!", description: `Insumo "${newItemName}" adicionado.` });
  };

  const removeRegisteredItem = (idToRemove) => {
      setRegisteredItems(registeredItems.filter(item => item.id !== idToRemove));
  };

  return (
    <motion.div
      key="calculator"
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
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Calculadora de Orçamento
            </h2>
        </div>
        
        <form onSubmit={handleCalculate} className="space-y-6">
          
          <InputField 
            id="description"
            label="Descrição do Projeto/Peça"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Action figure, suporte de celular"
            required
          />

          <div className="grid md:grid-cols-2 gap-6">
             {renderSection("Peça", <Box className="w-6 h-6 text-purple-300"/>, <>
                <InputField
                    id="materialWeight"
                    label="Peso do Material"
                    type="number"
                    value={materialWeight}
                    onChange={(e) => setMaterialWeight(e.target.value)}
                    placeholder="0"
                    unit="gramas"
                    required
                />
                <InputField
                    id="printTime"
                    label="Tempo de Impressão"
                    type="text" // Changed to text to allow comma input
                    value={printTime}
                    onChange={handleCurrencyChange(setPrintTime)}
                    placeholder="0,00"
                    unit="horas"
                    required
                />
             </>)}

             {renderSection("Acabamento e Insumos", <Wand2 className="w-6 h-6 text-purple-300"/>, <>
                <InputField
                    id="otherCosts"
                    label="Custo de Acabamento"
                    type="text" // Changed to text to allow comma input
                    value={otherCosts}
                    onChange={handleCurrencyChange(setOtherCosts)}
                    placeholder="0,00"
                />
                <div>
                    <Label className="text-gray-300">Insumos Adicionais</Label>
                    <div className="flex gap-2 mt-2">
                       <Select value={selectedExtraItem} onValueChange={setSelectedExtraItem}>
                            <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white h-12 text-lg">
                                <SelectValue placeholder="Selecione um insumo" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                {(registeredItems || []).map((item) => (
                                    <SelectItem key={item.id} value={item.id}>{item.name} ({formatCurrency(item.price)})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button type="button" onClick={addExtraItem} className="bg-purple-600 hover:bg-purple-700 h-12 px-4 shrink-0">
                            <Plus className="w-5 h-5" />
                        </Button>
                    </div>
                     <AnimatePresence>
                     {extraItems.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 space-y-2"
                        >
                            {extraItems.map((item) => (
                                <motion.div
                                    key={item.instanceId}
                                    layout
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex justify-between items-center bg-gray-800/50 p-2 rounded-md"
                                >
                                    <span className="text-gray-300">{item.name} - {formatCurrency(item.price)}</span>
                                    <Button type="button" size="sm" variant="ghost" onClick={() => removeExtraItem(item.instanceId)} className="text-red-500 hover:bg-red-500/10 hover:text-red-400">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </motion.div>
                            ))}
                        </motion.div>
                     )}
                    </AnimatePresence>
                </div>
             </>)}
          </div>

           <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                  <Palette className="w-6 h-6 text-purple-300" />
                  <h3 className="text-xl font-semibold text-purple-300">Custos e Insumos</h3>
              </div>
              <Button type="button" variant="outline" onClick={handleEditSettings} className="bg-transparent hover:bg-white/10 border-white/20">
                  {isEditingSettings ? <><X className="w-4 h-4 mr-2" /> Fechar Edição</> : <><Edit className="w-4 h-4 mr-2" /> Editar</>}
              </Button>
            </div>
             <p className="text-sm text-gray-400 mt-2">Clique em "Editar" para gerenciar os valores de custo e cadastrar novos insumos.</p>
          </div>

          <AnimatePresence>
            {isEditingSettings && (
              <motion.div
                ref={settingsSectionRef}
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                className="bg-black/20 p-6 rounded-xl border border-purple-500/30 space-y-6 overflow-hidden"
              >
                <h4 className="text-lg font-semibold text-purple-300">Configurações de Custo</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <InputField 
                    id="materialCost" 
                    label="Custo do Filamento (kg)" 
                    type="text" // Changed to text
                    value={materialCost} 
                    onChange={handleCurrencyChange(setMaterialCost)} 
                  />
                  <InputField 
                    id="printerCost" 
                    label="Custo da Hora/Máquina" 
                    type="text" // Changed to text
                    value={printerCost} 
                    onChange={handleCurrencyChange(setPrinterCost)} 
                  />
                  <InputField 
                    id="energyCost" 
                    label="Custo da Hora/Energia" 
                    type="text" // Changed to text
                    value={energyCost} 
                    onChange={handleCurrencyChange(setEnergyCost)} 
                  />
                </div>
                
                <div className="border-t border-white/10 pt-6">
                    <h4 className="text-lg font-semibold text-purple-300 mb-4">Gerenciar Insumos Cadastrados</h4>
                    <div className="space-y-2 mb-4">
                        {(registeredItems || []).map(item => (
                            <div key={item.id} className="flex justify-between items-center bg-gray-800/50 p-2 rounded-md">
                                <span className="text-gray-300">{item.name} - {formatCurrency(item.price)}</span>
                                <Button type="button" size="icon" variant="ghost" onClick={() => removeRegisteredItem(item.id)} className="text-red-500 hover:bg-red-500/10 hover:text-red-400">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2 items-end">
                        <InputField id="newItemName" label="Nome do Insumo" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder="Ex: Tinta Acrílica" />
                        <InputField 
                          id="newItemPrice" 
                          label="Preço (R$)" 
                          type="text" // Changed to text
                          value={newItemPrice} 
                          onChange={handleCurrencyChange(setNewItemPrice)} 
                          placeholder="0,00" 
                        />
                         <Button type="button" onClick={addRegisteredItem} className="bg-purple-600 hover:bg-purple-700 h-12 px-4 shrink-0">
                            <Plus className="w-5 h-5 mr-1"/> Adicionar
                        </Button>
                    </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid md:grid-cols-3 gap-6">
             <div className="space-y-2">
                <Label className="text-gray-300">Quantidade</Label>
                <div className="flex items-center gap-4">
                    <Button type="button" variant="outline" className="bg-gray-800/50 border-gray-700" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</Button>
                    <Input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} className="bg-gray-800/50 border-gray-700 text-white text-center h-12 text-lg" />
                    <Button type="button" variant="outline" className="bg-gray-800/50 border-gray-700" onClick={() => setQuantity(q => q + 1)}>+</Button>
                </div>
             </div>
             <div className="space-y-2">
                <Label htmlFor="lossMargin" className="text-gray-300">Margem de Perda: <span className="font-bold text-orange-400">{lossMargin}%</span></Label>
                <Slider
                  id="lossMargin"
                  min={0}
                  max={100}
                  step={1}
                  value={[lossMargin]}
                  onValueChange={(value) => setLossMargin(value[0])}
                  className="[&>span>span]:bg-orange-500 [&>span]:bg-orange-500/30"
                />
             </div>
             <div className="space-y-2">
                <Label htmlFor="profitMargin" className="text-gray-300">Margem de Lucro: <span className="font-bold text-purple-300">{profitMargin}%</span></Label>
                <Slider
                  id="profitMargin"
                  min={0}
                  max={200}
                  step={5}
                  value={[profitMargin]}
                  onValueChange={(value) => setProfitMargin(value[0])}
                />
             </div>
          </div>

          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 border border-green-400/20">
            <div>
              <p className="text-lg text-gray-300">Valor Total Estimado:</p>
              <motion.p 
                key={finalTotal}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent"
              >
                {formatCurrency(finalTotal)}
              </motion.p>
              <p className="text-sm text-gray-400 mt-1">Valor por unidade: {formatCurrency(unitPrice)}</p>
            </div>
            <Button type="submit" size="lg" className="w-full md:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-8 px-10 text-lg rounded-xl shadow-lg hover:shadow-green-500/20">
              <CalculatorIcon className="w-6 h-6 mr-3" />
              Gerar Orçamento
            </Button>
          </div>

        </form>
      </div>
    </motion.div>
  );
};

export default Calculator;
