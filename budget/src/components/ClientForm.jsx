
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

const ClientForm = ({ calculationData, onComplete, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome, email e telefone.",
        variant: "destructive"
      });
      return;
    }

    onComplete(formData);
    
    toast({
      title: "Dados salvos! 🎉",
      description: "Gerando seu orçamento profissional..."
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="glass-effect rounded-2xl p-8 shadow-2xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
          <User className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
            Dados do Cliente
          </h2>
          <p className="text-gray-300 text-sm">Preencha as informações para o orçamento</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-200 flex items-center gap-2">
            <User className="w-4 h-4" />
            Nome Completo *
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 text-lg"
            placeholder="João Silva"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-200 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 text-lg"
              placeholder="joao@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-200 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Telefone *
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 text-lg"
              placeholder="(11) 98765-4321"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-gray-200 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Endereço
          </Label>
          <Input
            id="address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 text-lg"
            placeholder="Rua Exemplo, 123"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city" className="text-gray-200">Cidade</Label>
            <Input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 text-lg"
              placeholder="São Paulo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state" className="text-gray-200">Estado</Label>
            <Input
              id="state"
              name="state"
              type="text"
              value={formData.state}
              onChange={handleChange}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 text-lg"
              placeholder="SP"
              maxLength="2"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            onClick={onBack}
            variant="outline"
            className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10 py-6 text-lg rounded-xl"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
          
          <Button
            type="submit"
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Gerar Orçamento →
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ClientForm;
