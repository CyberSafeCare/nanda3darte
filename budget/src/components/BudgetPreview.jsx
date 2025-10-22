
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { toPng } from 'html-to-image';
import { ArrowLeft, RefreshCw, Printer, Copy, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const BudgetPreview = ({ budget, onBack, onNewBudget }) => {
  const { calculationData, clientData, type } = budget;
  const currentDate = new Date(budget.createdAt || new Date()).toLocaleDateString('pt-BR');
  const budgetNumber = budget.id || `ORC-${Date.now().toString().slice(-6)}`;
  const isProjectType = type === 'project';
  const budgetRef = useRef(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const companyData = {
    name: "Nanda 3D Arte",
    slogan: "Design e impressão 3D",
    cnpj: "33.150.333/0001-56",
    address: "Rua Potengi, 1482",
    cityState: "Cotia - SP",
    phone: "11 93321-9531 / 11-99662-6937",
    email: "comercial@nanda3darte.com.br",
    logoUrl: "https://horizons-cdn.hostinger.com/10a8c933-d5ea-4ab2-a7e2-e95bfb13c75f/b61956692a932af682b65ca0d7ef4729.png",
    logoAlt: "Logo Nanda 3D Arte"
  };
  
  const formatCurrency = (value) => `R$ ${(Number(value) || 0).toFixed(2).replace('.', ',')}`;

  const handlePrint = () => {
    document.body.classList.add('printing-budget');
    window.print();
    setTimeout(() => document.body.classList.remove('printing-budget'), 500);
  };

  const handleCopyToClipboard = () => {
    const text = `
Olá, ${clientData.name}! 👋

Segue o seu orçamento da Nanda 3D Arte:

📄 *Orçamento:* #${budgetNumber}
*Descrição:* ${calculationData.description}
${!isProjectType ? `*Quantidade:* ${calculationData.quantity} peça(s)` : ''}

💰 *Valor Total: ${formatCurrency(calculationData.total)}*

Agradecemos pela preferência!
Qualquer dúvida, estou à disposição.
    `.trim().replace(/^\s+/gm, '');

    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Mensagem copiada!",
        description: "Agora é só colar no WhatsApp. 😉"
      });
    }).catch(() => {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar a mensagem.",
        variant: "destructive"
      });
    });
  };

  const filter = (node) => {
    const exclusionClasses = ['print:hidden'];
    return !exclusionClasses.some((classname) => node.classList?.contains(classname));
  }

  const handleGenerateImage = () => {
    if (!budgetRef.current) return;
    setIsGeneratingImage(true);

    budgetRef.current.classList.add('generating-image');

    setTimeout(() => {
        toPng(budgetRef.current, { 
        cacheBust: true,
        filter: filter,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        })
        .then((dataUrl) => {
            const link = document.createElement('a');
            link.download = `orcamento-${budgetNumber}.png`;
            link.href = dataUrl;
            link.click();
            toast({
            title: 'Imagem gerada com sucesso!',
            description: 'O download da imagem foi iniciado.',
            });
        })
        .catch((err) => {
            console.error('oops, something went wrong!', err);
            toast({
            title: 'Erro ao gerar imagem',
            description: 'Tente novamente. Se o erro persistir, o logo pode ser a causa.',
            variant: 'destructive',
            });
        })
        .finally(() => {
            if (budgetRef.current) {
                budgetRef.current.classList.remove('generating-image');
            }
            setIsGeneratingImage(false);
        });
    }, 100);
  };
  
  const renderTable = () => {
    if (isProjectType) {
      return (
        <table className="w-full text-left">
          <thead className="bg-white/5 generating-image:bg-gray-100 print:bg-gray-100">
            <tr>
              <th className="p-3 text-sm font-semibold tracking-wide">Descrição</th>
              <th className="p-3 text-sm font-semibold tracking-wide text-right">Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/10 generating-image:border-gray-200 print:border-gray-200">
              <td className="p-3">{calculationData.description}</td>
              <td className="p-3 text-right">{formatCurrency(calculationData.total)}</td>
            </tr>
            {calculationData.deadline && (
              <tr className="border-b border-white/10 generating-image:border-gray-200 print:border-gray-200 text-sm">
                <td className="p-3 pl-6 text-gray-300 generating-image:text-gray-600 print:text-gray-600">↳ Prazo de Entrega</td>
                <td className="p-3 text-right text-gray-300 generating-image:text-gray-600 print:text-gray-600">{calculationData.deadline}</td>
              </tr>
            )}
          </tbody>
        </table>
      )
    }
    
    const totalInsumosCost = calculationData.insumos ? calculationData.insumos.reduce((acc, item) => acc + (item.price * calculationData.quantity), 0) : 0;
    const itemSubtotal = calculationData.total - totalInsumosCost;
    const itemUnitPrice = itemSubtotal / calculationData.quantity;

    return (
      <table className="w-full text-left">
        <thead className="bg-white/5 generating-image:bg-gray-100 print:bg-gray-100">
          <tr>
            <th className="p-3 text-sm font-semibold tracking-wide">Descrição</th>
            <th className="p-3 text-sm font-semibold tracking-wide text-right">Qtd.</th>
            <th className="p-3 text-sm font-semibold tracking-wide text-right">Valor Unit.</th>
            <th className="p-3 text-sm font-semibold tracking-wide text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-white/10 generating-image:border-gray-200 print:border-gray-200">
            <td className="p-3">{calculationData.description}</td>
            <td className="p-3 text-right">{calculationData.quantity}</td>
            <td className="p-3 text-right">{formatCurrency(itemUnitPrice)}</td>
            <td className="p-3 text-right">{formatCurrency(itemSubtotal)}</td>
          </tr>
          {calculationData.insumos && calculationData.insumos.map((item, index) => (
            <tr key={index} className="border-b border-white/10 generating-image:border-gray-200 print:border-gray-200 text-sm">
              <td className="p-3 pl-6 text-gray-300 generating-image:text-gray-600 print:text-gray-600">↳ {item.name}</td>
              <td className="p-3 text-right text-gray-300 generating-image:text-gray-600 print:text-gray-600">{calculationData.quantity}</td>
              <td className="p-3 text-right text-gray-300 generating-image:text-gray-600 print:text-gray-600">{formatCurrency(item.price)}</td>
              <td className="p-3 text-right text-gray-300 generating-image:text-gray-600 print:text-gray-600">{formatCurrency(item.price * calculationData.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="space-y-6"
    >
      <div id="budget-to-print" ref={budgetRef} className="glass-effect rounded-2xl p-8 shadow-2xl print:shadow-none print:border print:border-gray-300 print:bg-white print:text-black generating-image:shadow-none generating-image:border generating-image:border-gray-300 generating-image:bg-white generating-image:text-black">
        <header className="flex flex-col md:flex-row justify-between items-start mb-8 print:mb-6">
          <div className="flex items-center gap-4">
            <img alt={companyData.logoAlt} className="w-24 h-24 object-contain rounded-lg p-2 bg-white/10 generating-image:bg-transparent print:bg-transparent" src={companyData.logoUrl} />
            <div>
              <h1 className="text-2xl font-bold text-white generating-image:text-black print:text-black">{companyData.name}</h1>
              <p className="text-gray-300 generating-image:text-gray-600 print:text-gray-600">{companyData.slogan}</p>
              <p className="text-sm text-gray-400 generating-image:text-gray-500 print:text-gray-500">CNPJ: {companyData.cnpj}</p>
            </div>
          </div>
          <div className="text-left md:text-right mt-4 md:mt-0">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent generating-image:text-black generating-image:bg-none print:text-black print:bg-none">Orçamento</h2>
            <p className="text-gray-300 generating-image:text-gray-600 print:text-gray-600">#{budgetNumber}</p>
            <p className="mt-2 text-gray-300 generating-image:text-gray-600 print:text-gray-600">Data: <span className="font-semibold text-white generating-image:text-black print:text-black">{currentDate}</span></p>
          </div>
        </header>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8 pb-6 border-b border-white/10 generating-image:border-gray-300 print:border-gray-300">
            <div className="bg-white/5 rounded-xl p-4 generating-image:bg-gray-50 generating-image:border print:bg-gray-50 print:border">
              <h3 className="font-semibold text-purple-300 generating-image:text-purple-700 print:text-purple-700 mb-2">Empresa</h3>
              <div className="text-sm text-gray-200 generating-image:text-gray-700 print:text-gray-700 space-y-1">
                  <p>{companyData.address}, {companyData.cityState}</p>
                  <p>{companyData.email}</p>
                  <p>{companyData.phone}</p>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 generating-image:bg-gray-50 generating-image:border print:bg-gray-50 print:border">
              <h3 className="font-semibold text-purple-300 generating-image:text-purple-700 print:text-purple-700 mb-2">Cliente</h3>
              <div className="text-sm text-gray-200 generating-image:text-gray-700 print:text-gray-700 space-y-1">
                  <p className="font-medium text-white generating-image:text-black print:text-black">{clientData.name}</p>
                  <p>{clientData.email}</p>
                  <p>{clientData.phone}</p>
              </div>
            </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-100 generating-image:text-black print:text-black">Itens do Orçamento</h3>
          <div className="overflow-x-auto">
              {renderTable()}
          </div>

          <div className="flex justify-end mt-4">
            <div className="w-full max-w-sm space-y-4">
                <div className="flex justify-between items-center bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-4 rounded-lg generating-image:bg-green-100 print:bg-green-100">
                  <span className="text-xl font-semibold text-gray-200 generating-image:text-black print:text-black">Valor Total:</span>
                  <motion.span
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="text-3xl font-bold text-green-300 generating-image:text-green-700 print:text-green-700"
                  >
                    {formatCurrency(calculationData.total)}
                  </motion.span>
                </div>
            </div>
          </div>
          
           <div className="text-center text-sm text-gray-400 pt-6 border-t border-white/10 generating-image:text-gray-600 generating-image:border-gray-300 print:text-gray-600 print:border-gray-300">
            <p>Orçamento válido por 15 dias. Agradecemos pela preferência!</p>
            <p className="mt-1 font-bold">{companyData.name}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 justify-center print:hidden pt-4">
        <Button onClick={onBack} variant="outline" className="py-6 text-lg bg-white/5 border-white/20 hover:bg-white/10"><ArrowLeft className="w-5 h-5 mr-2" />Voltar</Button>
        <Button onClick={handleCopyToClipboard} className="py-6 text-lg bg-gradient-to-r from-green-500 to-teal-500"><Copy className="w-5 h-5 mr-2" />p/ Whats</Button>
        <Button onClick={handleGenerateImage} disabled={isGeneratingImage} className="py-6 text-lg bg-gradient-to-r from-sky-500 to-indigo-500">
            {isGeneratingImage ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <ImageIcon className="w-5 h-5 mr-2" />}
            {isGeneratingImage ? 'Gerando...' : 'Imagem'}
        </Button>
        <Button onClick={handlePrint} className="py-6 text-lg bg-gradient-to-r from-blue-600 to-cyan-600">
            <Printer className="w-5 h-5 mr-2" />
            Imprimir
        </Button>
        <Button onClick={onNewBudget} className="col-span-2 md:col-span-3 py-6 text-lg bg-gradient-to-r from-purple-600 to-indigo-600"><RefreshCw className="w-5 h-5 mr-2" />Novo Orçamento</Button>
      </div>
    </motion.div>
  );
};

export default BudgetPreview;
